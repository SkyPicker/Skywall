import asyncio
from aiohttp import ClientSession, WSCloseCode, WSMsgType
from skywall.core.config import config
from skywall.core.actions import send_action, parse_client_action
from skywall.core.reports import collect_report
from skywall.core.constants import CLIENT_ID_HEADER, CLIENT_TOKEN_HEADER
from skywall.actions.reports import SaveReportServerAction
from skywall.actions.labels import SaveLabelServerAction


class WebsocketClient:

    def __init__(self, loop):
        self.url = config.get('server.publicUrl')
        self.client_id = config.get('client.id')
        self.client_token = config.get('client.token')
        self.reports_frequency = config.get('client.reports.frequency')
        self.loop = loop
        self.session = None
        self.connection = None

    def __enter__(self):
        headers = self.headers()
        self.session = ClientSession(loop=self.loop)
        self.connection = self.loop.run_until_complete(self.session.ws_connect(self.url, headers=headers))
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.connection:
            self.loop.run_until_complete(self.connection.close(code=WSCloseCode.GOING_AWAY))
        if self.session:
            self.loop.run_until_complete(self.session.close())

    def headers(self):
        headers = {}
        headers[CLIENT_ID_HEADER] = str(self.client_id)
        headers[CLIENT_TOKEN_HEADER] = str(self.client_token)
        return headers

    def label(self):
        label = config.get('client.label')
        send_action(self.connection, SaveLabelServerAction(label=label))

    def reports(self):
        report = collect_report()
        send_action(self.connection, SaveReportServerAction(report=report))
        self.loop.call_later(self.reports_frequency, self.reports)

    async def connect(self):
        self.label()
        self.reports()
        async for msg in self.connection:
            if msg.type != WSMsgType.TEXT:
                continue
            try:
                action = parse_client_action(msg.data)
            except Exception:
                print('Invalid message received: {}'.format(msg.data))
                continue
            try:
                print('Received action "{}" with payload: {}'.format(action.name, action.payload))
                action.execute(self.connection)
            except Exception as e:
                print('Executing action "{}" failed: {}'.format(action.name, e))


def run_client():
    loop = asyncio.get_event_loop()
    with WebsocketClient(loop) as client:
        try:
            loop.run_until_complete(client.connect())
        except KeyboardInterrupt:
            pass
    loop.close()
