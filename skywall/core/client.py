import asyncio
from aiohttp import ClientSession, WSCloseCode, WSMsgType
from skywall.core.config import config
from skywall.core.actions import parse_client_action
from skywall.core.reports import collect_report
from skywall.core.constants import CLIENT_ID_HEADER, CLIENT_TOKEN_HEADER
from skywall.actions.reports import SaveReportServerAction
from skywall.actions.labels import SaveLabelServerAction
from skywall.signals import (
        before_client_start, after_client_start, before_client_stop, after_client_stop,
        before_server_action_send, after_server_action_send,
        before_client_action_receive, after_client_action_receive
        )

class WebsocketClient:

    def __init__(self, loop):
        self.url = config.get('server.publicUrl')
        self.client_id = config.get('client.id')
        self.client_token = config.get('client.token')
        self.reports_frequency = config.get('client.reports.frequency')
        self.loop = loop
        self.session = None
        self.socket = None

    def __enter__(self):
        before_client_start.emit(client=self)
        headers = self._headers()
        self.session = ClientSession(loop=self.loop)
        self.socket = self.loop.run_until_complete(self.session.ws_connect(self.url, headers=headers))
        after_client_start.emit(client=self)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        before_client_stop.emit(client=self)
        if self.socket:
            self.loop.run_until_complete(self.socket.close(code=WSCloseCode.GOING_AWAY))
        if self.session:
            self.loop.run_until_complete(self.session.close())
        after_client_stop.emit(client=self)

    def _headers(self):
        headers = {}
        headers[CLIENT_ID_HEADER] = str(self.client_id)
        headers[CLIENT_TOKEN_HEADER] = str(self.client_token)
        return headers

    def send_action(self, action):
        before_server_action_send.emit(client=self, action=action)
        self.socket.send_json(dict(action=action.name, payload=action.payload))
        after_server_action_send.emit(client=self, action=action)

    def send_label(self):
        label = config.get('client.label')
        self.send_action(SaveLabelServerAction(label=label))

    def send_reports(self):
        report = collect_report()
        self.send_action(SaveReportServerAction(report=report))
        self.loop.call_later(self.reports_frequency, self.send_reports)

    async def connect(self):
        self.send_label()
        self.send_reports()
        async for msg in self.socket:
            if msg.type != WSMsgType.TEXT:
                continue
            try:
                action = parse_client_action(msg.data)
            except Exception:
                print('Invalid message received: {}'.format(msg.data))
                continue
            try:
                print('Received action "{}" with payload: {}'.format(action.name, action.payload))
                before_client_action_receive.emit(client=self, action=action)
                action.execute(self)
                after_client_action_receive.emit(client=self, action=action)
            except Exception as e:
                print('Executing action "{}" failed: {}'.format(action.name, e))


_client = None

def run_client():
    # pylint: disable=global-statement
    global _client
    loop = asyncio.get_event_loop()
    with WebsocketClient(loop) as _client:
        try:
            loop.run_until_complete(_client.connect())
        except KeyboardInterrupt:
            pass
        finally:
            _client = None
    loop.close()


def get_client():
    return _client
