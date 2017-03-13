import asyncio
import aiohttp
import aiohttp.web
from aiohttp_swagger import setup_swagger
from core.config import config
from core.routes import routes


class WebsocketServer:

    def __init__(self, loop):
        self.host = config.get('server.host')
        self.port = config.get('server.port')
        self.loop = loop
        self.connections = []

    def __enter__(self):
        self.app = aiohttp.web.Application(loop=self.loop)
        self.app.router.add_get('/', self._connect)
        self.app.on_shutdown.append(self._shutdown)

        self.handler = self.app.make_handler()
        self.loop.run_until_complete(self.app.startup())
        self.server = self.loop.run_until_complete(self.loop.create_server(self.handler, self.host, self.port))

        print('Websocket server listening on http://{}:{}'.format(self.host, self.port))
        return self

    def __exit__(self, type, value, tb):
        self.server.close()
        self.loop.run_until_complete(self.server.wait_closed())
        self.loop.run_until_complete(self.app.shutdown())
        self.loop.run_until_complete(self.handler.shutdown(60))
        self.loop.run_until_complete(self.app.cleanup())

    async def _connect(self, request):
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

    async def _shutdown(self, app):
        for connection in self.connections:
            await connection.close(code=aiohttp.WSCloseCode.GOING_AWAY)


class WebServer:

    def __init__(self, loop):
        self.host = config.get('webserver.host')
        self.port = config.get('webserver.port')
        self.loop = loop

    def __enter__(self):
        self.app = aiohttp.web.Application(loop=self.loop)
        for route in routes:
            self.app.router.add_route(route.method, '/api' + route.path, route.handler)
        setup_swagger(self.app, swagger_url='/api', title='Skywall web API')

        self.handler = self.app.make_handler()
        self.loop.run_until_complete(self.app.startup())
        self.server = self.loop.run_until_complete(self.loop.create_server(self.handler, self.host, self.port))

        print('Web server listening on http://{}:{}'.format(self.host, self.port))
        return self

    def __exit__(self, type, value, tb):
        self.server.close()
        self.loop.run_until_complete(self.server.wait_closed())
        self.loop.run_until_complete(self.app.shutdown())
        self.loop.run_until_complete(self.handler.shutdown(60))
        self.loop.run_until_complete(self.app.cleanup())


def runServer():
    loop = asyncio.get_event_loop()
    with WebsocketServer(loop), WebServer(loop):
        try:
            loop.run_forever()
        except KeyboardInterrupt:
            pass
    loop.close()
