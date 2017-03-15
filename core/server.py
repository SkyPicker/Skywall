import json
import asyncio
from aiohttp import WSMsgType, WSCloseCode
from aiohttp.web import Application, WebSocketResponse, HTTPBadRequest, HTTPForbidden
from aiohttp_swagger import setup_swagger
from core.config import config
from core.routes import routes
from core.database import Session
from core.constants import CLIENT_ID_HEADER, CLIENT_TOKEN_HEADER
from core.utils import randomstring
from models.client import Client


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
            return client

        session = Session()
        client = session.query(Client).filter(Client.id == client_id).first()
        if not client or client.token != client_token:
            raise HTTPForbidden(reason='Invalid Client ID or Token')
        return client

    async def connect(self, request):
        client = self.get_client(request)
        connection = WebSocketResponse()
        await connection.prepare(request)
        self.connections.append(connection)
        try:
            connection.send_json(dict(action='setClientId', client_id=client.id, client_token=client.token))
            async for msg in connection:
                if msg.type == WSMsgType.TEXT:
                    try:
                        data = json.loads(msg.data)
                        action = data['action']
                    except (ValueError, KeyError):
                        print('Invalid message received: {}'.format(msg.data))
                    else:
                        if action == 'hello':
                            print('Hello: {text}'.format(**data))
                            connection.send_str(msg.data)
                        else:
                            print('Invalid message received: {}'.format(msg.data))
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
        for route in routes:
            self.app.router.add_route(route.method, '/api' + route.path, route.handler)
        setup_swagger(self.app, swagger_url='/api', title='Skywall web API')

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


def run_server():
    loop = asyncio.get_event_loop()
    with WebsocketServer(loop), WebServer(loop):
        try:
            loop.run_forever()
        except KeyboardInterrupt:
            pass
    loop.close()
