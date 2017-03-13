import asyncio
import aiohttp
from core.config import config
from core.commands import AbstractCommand, registerCommand


@registerCommand
class ClientCommand(AbstractCommand):
    name = 'client'
    help = 'Run skywall client'

    session = None
    connection = None

    def hello(self):
        self.connection.send_str('Hello, world!')
        self.session.loop.call_later(1, self.hello)

    async def connect(self, loop):
        url = config.get('server.publicUrl')
        self.session = aiohttp.ClientSession(loop=loop)
        self.connection = await self.session.ws_connect(url)

        self.hello()
        async for msg in self.connection:
            if msg.type == aiohttp.WSMsgType.TEXT:
                print('Text message received: {0}'.format(msg.data))

    def run(self, args):
        loop = asyncio.get_event_loop()
        try:
            loop.run_until_complete(self.connect(loop))
        except KeyboardInterrupt:
            pass
        finally:
            if self.connection:
                loop.run_until_complete(self.connection.close(code=aiohttp.WSCloseCode.GOING_AWAY))
            if self.session:
                loop.run_until_complete(self.session.close())
        loop.close()
