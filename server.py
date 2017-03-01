import asyncio
from autobahn.asyncio.websocket import WebSocketServerProtocol, WebSocketServerFactory


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


if __name__ == '__main__':
    factory = WebSocketServerFactory('ws://127.0.0.1:8080')
    factory.protocol = SkywallServerProtocol
    loop = asyncio.get_event_loop()
    coro = loop.create_server(factory, '0.0.0.0', 8080)
    server = loop.run_until_complete(coro)

    try:
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.close()
        loop.close()
