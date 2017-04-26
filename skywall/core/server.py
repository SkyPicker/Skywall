import os
import asyncio
import subprocess
import contextlib
from aiohttp import WSMsgType, WSCloseCode
from aiohttp.web import Application, WebSocketResponse, HTTPBadRequest, HTTPForbidden
from aiohttp_swagger import setup_swagger
from skywall.core.constants import ACTION_CONFIRM_TIMEOUT
from skywall.core.config import config
from skywall.core.api import api_registry
from skywall.core.database import create_session
from skywall.core.actions import parse_server_action
from skywall.core.constants import CLIENT_ID_HEADER, CLIENT_TOKEN_HEADER, API_ROUTE, STATIC_ROUTE, BUILD_ROUTE
from skywall.core.utils import randomstring
from skywall.models.client import Client
from skywall.actions.clientid import SetIdClientAction
from skywall.signals import (
        before_server_start, after_server_start, before_server_stop, after_server_stop,
        before_server_connection_open, after_server_connection_open,
        before_server_connection_close, after_server_connection_close, after_server_connection_ended,
        before_client_action_send, after_client_action_send, after_client_action_confirm,
        before_server_action_receive, after_server_action_receive,
        )
from skywall.frontend import frontend


class WebsocketConnection:

    def __init__(self, server, request):
        self.client_id = self._get_request_client_id(request)
        self.server = server
        self.request = request
        self.socket = None

    def _get_request_client_id(self, request):
        try:
            client_id = request.headers[CLIENT_ID_HEADER]
            client_token = request.headers[CLIENT_TOKEN_HEADER]
        except KeyError:
            raise HTTPBadRequest(reason='Missing Client ID or Token Header')

        with create_session() as session:
            if client_id == 'None':
                client = Client(token=randomstring(32))
                session.add(client)
                session.flush()
            else:
                client = session.query(Client).filter(Client.id == client_id).first()
                if not client or client.token != client_token:
                    raise HTTPForbidden(reason='Invalid Client ID or Token')
            return client.id

    def _process_confirm(self, action):
        try:
            print('Received confirmation of action "{}" with payload: {}'.format(action.name, action.payload))
            after_client_action_confirm.emit(connection=self, action=action)
        except Exception as e:
            print('Processing confirmation of action "{}" failed: {}'.format(action.name, e))

    def _process_action(self, action):
        try:
            print('Received action "{}" with payload: {}'.format(action.name, action.payload))
            before_server_action_receive.emit(connection=self, action=action)
            action.execute(self)
            after_server_action_receive.emit(connection=self, action=action)
            self.socket.send_json(action.send_confirm())
        except Exception as e:
            print('Executing action "{}" failed: {}'.format(action.name, e))

    def _process_message(self, msg):
        if msg.type != WSMsgType.TEXT:
            return
        try:
            action = parse_server_action(msg.data)
        except Exception as e:
            print('Invalid message received: {}; Error: {}'.format(msg.data, e))
            return
        if action.confirm:
            self._process_confirm(action)
        else:
            self._process_action(action)

    async def connect(self):
        before_server_connection_open.emit(connection=self)
        self.socket = WebSocketResponse()
        await self.socket.prepare(self.request)
        after_server_connection_open.emit(connection=self)
        self.send_client_id()
        async for msg in self.socket:
            self._process_message(msg)
        after_server_connection_ended.emit(connection=self)

    async def close(self):
        before_server_connection_close.emit(connection=self)
        self.socket.close(code=WSCloseCode.GOING_AWAY)
        after_server_connection_close.emit(connection=self)

    def send_action(self, action):
        before_client_action_send.emit(connection=self, action=action)
        self.socket.send_json(action.send())
        after_client_action_send.emit(connection=self, action=action)

    async def check_send_action(self, action):
        future = asyncio.Future()
        sent_action = action

        def listener(connection, action):
            if connection is not self:
                return
            if action.name != sent_action.name:
                return
            if action.action_id != sent_action.action_id:
                return
            if not future.done():
                future.set_result(True)

        with after_client_action_confirm.connected(listener):
            self.send_action(sent_action)
            await asyncio.wait_for(future, ACTION_CONFIRM_TIMEOUT)

    def send_client_id(self):
        with create_session() as session:
            client = session.query(Client).filter(Client.id == self.client_id).first()
            self.send_action(SetIdClientAction(client_id=client.id, client_token=client.token))


class WebsocketServer:

    def __init__(self, loop):
        self.host = config.get('server.host')
        self.port = config.get('server.port')
        self.loop = loop
        self.app = None
        self.handler = None
        self.server = None
        self.connections = []

    def __enter__(self):
        before_server_start.emit(server=self)
        self.app = Application(loop=self.loop)
        self.app.router.add_get('/', self._connect)
        self.app.on_shutdown.append(self._on_shutdown)

        self.handler = self.app.make_handler()
        self.loop.run_until_complete(self.app.startup())
        self.server = self.loop.run_until_complete(self.loop.create_server(self.handler, self.host, self.port))

        print('Websocket server listening on http://{}:{}'.format(self.host, self.port))
        after_server_start.emit(server=self)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        before_server_stop.emit(server=self)
        self.server.close()
        self.loop.run_until_complete(self.server.wait_closed())
        self.loop.run_until_complete(self.app.shutdown())
        self.loop.run_until_complete(self.handler.shutdown(60))
        self.loop.run_until_complete(self.app.cleanup())
        after_server_stop.emit(server=self)

    async def _connect(self, request):
        connection = WebsocketConnection(self, request)
        self.connections.append(connection)
        try:
            await connection.connect()
        finally:
            self.connections.remove(connection)
        return connection.socket

    async def _on_shutdown(self, app):
        for connection in self.connections:
            await connection.close()

    def get_connection(self, client_id):
        for connection in self.connections:
            if connection.client_id == client_id:
                return connection
        return None


class WebServer:

    def __init__(self, loop):
        self.host = config.get('webserver.host')
        self.port = config.get('webserver.port')
        self.loop = loop
        self.app = None
        self.handler = None
        self.server = None

    def __enter__(self):
        self.app = Application(loop=self.loop)
        for api in api_registry:
            self.app.router.add_route(api.method, API_ROUTE + api.path, api.handler)
        setup_swagger(self.app, swagger_url=API_ROUTE, title='Skywall web API')
        self.app.router.add_static(STATIC_ROUTE, 'skywall/frontend/static')
        if os.path.isdir('build'):
            self.app.router.add_static(BUILD_ROUTE, 'build')
        self.app.router.add_get('/{tail:.*}', frontend)

        self.handler = self.app.make_handler()
        self.loop.run_until_complete(self.app.startup())
        self.server = self.loop.run_until_complete(self.loop.create_server(self.handler, self.host, self.port))

        print('Web server listening on http://{}:{}'.format(self.host, self.port))
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.server.close()
        self.loop.run_until_complete(self.server.wait_closed())
        self.loop.run_until_complete(self.app.shutdown())
        self.loop.run_until_complete(self.handler.shutdown(60))
        self.loop.run_until_complete(self.app.cleanup())


class WebpackServer:

    def __init__(self):
        self.host = config.get('webpack.host')
        self.port = config.get('webpack.port')
        self.process = None

    def __enter__(self):
        env = dict(os.environ, WEBPACK_HOST=self.host, WEBPACK_PORT=str(self.port))
        self.process = subprocess.Popen(['npm', 'run', 'webpack'], env=env)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.process.terminate()


_server = None

def run_server():
    # pylint: disable=global-statement
    global _server
    loop = asyncio.get_event_loop()
    with contextlib.ExitStack() as stack:
        _server = stack.enter_context(WebsocketServer(loop))
        stack.enter_context(WebServer(loop))
        if config.get('devel'):
            stack.enter_context(WebpackServer())
        try:
            loop.run_forever()
        finally:
            _server = None
    loop.close()


def get_server():
    return _server
