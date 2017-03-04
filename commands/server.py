import asyncio
from autobahn.asyncio.websocket import WebSocketServerProtocol, WebSocketServerFactory
from core.config import config
from core.commands import AbstractCommand, registerCommand


class SkywallServerProtocol(WebSocketServerProtocol):

    def onConnect(self, request):
        print('Client connecting: {0}'.format(request.peer))

    def onOpen(self):
        print('WebSocket connection open.')

    def onMessage(self, payload, isBinary):
        print('Text message received: {0}'.format(payload.decode('utf8')))
        self.sendMessage(payload, isBinary)

    def onClose(self, wasClean, code, reason):
        print('WebSocket connection closed: {0}'.format(reason))


@registerCommand
class ServerCommand(AbstractCommand):
    name = 'server'
    help = 'Run skywall server'

    def run(self, args):
        host = config.get('server.host')
        port = config.get('server.port')
        publicUrl = config.get('server.publicUrl')

        factory = WebSocketServerFactory(publicUrl)
        factory.protocol = SkywallServerProtocol
        loop = asyncio.get_event_loop()
        coro = loop.create_server(factory, host, port)
        server = loop.run_until_complete(coro)

        try:
            loop.run_forever()
        except KeyboardInterrupt:
            pass
        finally:
            server.close()
            loop.close()
