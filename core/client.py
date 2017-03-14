import json
import asyncio
from aiohttp import ClientSession, WSCloseCode, WSMsgType
from core.config import config
from core.constants import CLIENT_ID_HEADER, CLIENT_TOKEN_HEADER


class WebsocketClient:

    def __init__(self, loop):
        self.url = config.get('server.publicUrl')
        self.clientId = config.get('client.id')
        self.clientToken = config.get('client.token')
        self.loop = loop

    def __enter__(self):
        headers = self.headers()
        self.session = ClientSession(loop=self.loop)
        self.connection = self.loop.run_until_complete(self.session.ws_connect(self.url, headers=headers))
        return self

    def __exit__(self, type, value, tb):
        if self.connection:
            self.loop.run_until_complete(self.connection.close(code=WSCloseCode.GOING_AWAY))
        if self.session:
            self.loop.run_until_complete(self.session.close())

    def headers(self):
        headers = {}
        headers[CLIENT_ID_HEADER] = str(self.clientId)
        headers[CLIENT_TOKEN_HEADER] = str(self.clientToken)
        return headers

    def hello(self):
        self.connection.send_json(dict(action='hello', text='Hello, world!'))
        self.loop.call_later(1, self.hello)

    async def connect(self):
        self.hello()
        async for msg in self.connection:
            if msg.type == WSMsgType.TEXT:
                try:
                    data = json.loads(msg.data)
                    action = data['action']
                except (ValueError, KeyError):
                    print('Invalid message received: {}'.format(msg.data))
                else:
                    if action == 'setClientId':
                        config.set('client.id', data['clientId'])
                        config.set('client.token', data['clientToken'])
                        config.save()
                        print('clientId: {clientId} {clientToken}'.format(**data))
                    elif action == 'hello':
                        print('Hello: {text}'.format(**data))
                    else:
                        print('Invalid message received: {}'.format(msg.data))


def runClient():
    loop = asyncio.get_event_loop()
    with WebsocketClient(loop) as client:
        try:
            loop.run_until_complete(client.connect())
        except KeyboardInterrupt:
            pass
    loop.close()
