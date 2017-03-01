import asyncio
from autobahn.asyncio.websocket import WebSocketClientProtocol, WebSocketClientFactory


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


if __name__ == '__main__':
    factory = WebSocketClientFactory('ws://127.0.0.1:8080')
    factory.protocol = SkywallClientProtocol
    loop = asyncio.get_event_loop()
    coro = loop.create_connection(factory, '127.0.0.1', 8080)
    loop.run_until_complete(coro)

    try:
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        loop.close()
