import asyncio
from autobahn.asyncio.websocket import WebSocketClientProtocol, WebSocketClientFactory
from core.config import config
from core.commands import AbstractCommand, registerCommand


class SkywallClientProtocol(WebSocketClientProtocol):

    def onConnect(self, response):
        print('Server connected: {0}'.format(response.peer))

    def onOpen(self):
        print('WebSocket connection open.')

        def hello():
            self.sendMessage('Hello, world!'.encode('utf8'))
            self.factory.loop.call_later(1, hello)

        hello()

    def onMessage(self, payload, isBinary):
        print('Text message received: {0}'.format(payload.decode('utf8')))

    def onClose(self, wasClean, code, reason):
        print('WebSocket connection closed: {0}'.format(reason))


@registerCommand
class ClientCommand(AbstractCommand):
    name = 'client'
    help = 'Run skywall client'

    def run(self, args):
        host = config.get('server.host')
        port = config.get('server.port')
        publicUrl = config.get('server.publicUrl')

        factory = WebSocketClientFactory(publicUrl)
        factory.protocol = SkywallClientProtocol
        loop = asyncio.get_event_loop()
        coro = loop.create_connection(factory, host, port)
        loop.run_until_complete(coro)

        try:
            loop.run_forever()
        except KeyboardInterrupt:
            pass
        finally:
            loop.close()
