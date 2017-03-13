import asyncio
import aiohttp
from core.config import config


class WebsocketClient:

    def __init__(self, loop):
        self.url = config.get('server.publicUrl')
        self.loop = loop

    def __enter__(self):
        self.session = aiohttp.ClientSession(loop=self.loop)
        self.connection = self.loop.run_until_complete(self.session.ws_connect(self.url))
        return self

    def __exit__(self, type, value, tb):
        if self.connection:
            self.loop.run_until_complete(self.connection.close(code=aiohttp.WSCloseCode.GOING_AWAY))
        if self.session:
            self.loop.run_until_complete(self.session.close())

    def hello(self):
        self.connection.send_str('Hello, world!')
        self.loop.call_later(1, self.hello)

    async def connect(self):
        self.hello()
        async for msg in self.connection:
            if msg.type == aiohttp.WSMsgType.TEXT:
                print('Text message received: {0}'.format(msg.data))


def runClient():
    loop = asyncio.get_event_loop()
    with WebsocketClient(loop) as client:
        try:
            loop.run_until_complete(client.connect())
        except KeyboardInterrupt:
            pass
    loop.close()
