import asyncio
import aiohttp
import aiohttp.web
from aiohttp_swagger import setup_swagger
from core.config import config
from core.routes import routes
from core.commands import AbstractCommand, registerCommand
from core.database import connectDatabase


class WebsocketServer:

    def __init__(self, loop):
        host = config.get('server.host')
        port = config.get('server.port')

        self.connections = []
        self.app = aiohttp.web.Application(loop=loop)
        self.app.router.add_get('/', self.connect)
        self.app.on_shutdown.append(self.shutdown)

        self.handler = self.app.make_handler()
        loop.run_until_complete(self.app.startup())
        self.server = loop.run_until_complete(loop.create_server(self.handler, host, port))
        print('Websocket server listening on http://{}:{}'.format(host, port))

    async def connect(self, request):
        connection = aiohttp.web.WebSocketResponse()
        await connection.prepare(request)
        self.connections.append(connection)
        try:
            async for msg in connection:
                if msg.type == aiohttp.WSMsgType.TEXT:
                    print('Text message received: {0}'.format(msg.data))
                    connection.send_str(msg.data)
        finally:
            self.connections.remove(connection)
        return connection

    async def shutdown(self, app):
        for connection in self.connections:
            await connection.close(code=aiohttp.WSCloseCode.GOING_AWAY)


class WebServer:

    def __init__(self, loop):
        host = config.get('webserver.host')
        port = config.get('webserver.port')

        self.app = aiohttp.web.Application(loop=loop)
        for route in routes:
            self.app.router.add_route(route.method, '/api' + route.path, route.handler)
        setup_swagger(self.app, swagger_url='/api', title='Skywall web API')

        self.handler = self.app.make_handler()
        loop.run_until_complete(self.app.startup())
        self.server = loop.run_until_complete(loop.create_server(self.handler, host, port))
        print('Web server listening on http://{}:{}'.format(host, port))


@registerCommand
class ServerCommand(AbstractCommand):
    name = 'server'
    help = 'Run skywall server'

    def runServers(self):
        loop = asyncio.get_event_loop()
        websocket = WebsocketServer(loop)
        web = WebServer(loop)

        try:
            loop.run_forever()
        except KeyboardInterrupt:
            pass
        finally:
            for server in (websocket, web):
                server.server.close()
                loop.run_until_complete(server.server.wait_closed())
                loop.run_until_complete(server.app.shutdown())
                loop.run_until_complete(server.handler.shutdown(60))
                loop.run_until_complete(server.app.cleanup())
        loop.close()

    def run(self, args):
        connectDatabase()
        self.runServers()
