import os
import asyncio
import subprocess
import contextlib
from aiohttp import WSMsgType, WSCloseCode
from aiohttp.web import Application, WebSocketResponse, HTTPBadRequest, HTTPForbidden
from aiohttp_swagger import setup_swagger
from skywall.core.config import config
from skywall.core.api import api_registry
from skywall.core.database import Session
from skywall.core.actions import send_action, parse_server_action
from skywall.core.constants import CLIENT_ID_HEADER, CLIENT_TOKEN_HEADER, API_ROUTE, STATIC_ROUTE, BUILD_ROUTE
from skywall.core.utils import randomstring
from skywall.models.client import Client
from skywall.actions.clientid import SetIdClientAction
from skywall.frontend import frontend


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
        self.app = Application(loop=self.loop)
        self.app.router.add_get('/', self.connect)
        self.app.on_shutdown.append(self.on_shutdown)

        self.handler = self.app.make_handler()
        self.loop.run_until_complete(self.app.startup())
        self.server = self.loop.run_until_complete(self.loop.create_server(self.handler, self.host, self.port))

        print('Websocket server listening on http://{}:{}'.format(self.host, self.port))
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.server.close()
        self.loop.run_until_complete(self.server.wait_closed())
        self.loop.run_until_complete(self.app.shutdown())
        self.loop.run_until_complete(self.handler.shutdown(60))
        self.loop.run_until_complete(self.app.cleanup())

    def get_client(self, request):
        try:
            client_id = request.headers[CLIENT_ID_HEADER]
            client_token = request.headers[CLIENT_TOKEN_HEADER]
        except KeyError:
            raise HTTPBadRequest(reason='Missing Client ID or Token Header')

        if client_id == 'None':
            session = Session()
            client = Client(token=randomstring(32))
            session.add(client)
            session.commit()
            session.close()
            return client

        session = Session()
        client = session.query(Client).filter(Client.id == client_id).first()
        session.close()
        if not client or client.token != client_token:
            raise HTTPForbidden(reason='Invalid Client ID or Token')
        return client

    async def connect(self, request):
        client = self.get_client(request)
        connection = WebSocketResponse()
        await connection.prepare(request)
        self.connections.append(connection)
        try:
            session = Session()
            session.add(client)
            send_action(connection, SetIdClientAction(client_id=client.id, client_token=client.token))
            session.close()
            async for msg in connection:
                if msg.type != WSMsgType.TEXT:
                    continue
                try:
                    action = parse_server_action(msg.data)
                except Exception:
                    print('Invalid message received: {}'.format(msg.data))
                    continue
                try:
                    print('Received action "{}" with payload: {}'.format(action.name, action.payload))
                    action.execute(connection, client)
                except Exception as e:
                    print('Executing action "{}" failed: {}'.format(action.name, e))
        finally:
            self.connections.remove(connection)
        return connection

    async def on_shutdown(self, app):
        for connection in self.connections:
            await connection.close(code=WSCloseCode.GOING_AWAY)


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


def run_server():
    loop = asyncio.get_event_loop()
    with contextlib.ExitStack() as stack:
        stack.enter_context(WebsocketServer(loop))
        stack.enter_context(WebServer(loop))
        if config.get('devel'):
            stack.enter_context(WebpackServer())
        try:
            loop.run_forever()
        except KeyboardInterrupt:
            pass
    loop.close()
