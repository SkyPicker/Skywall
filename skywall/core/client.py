import asyncio
from aiohttp import ClientSession, WSCloseCode, WSMsgType, ClientConnectionError, WSServerHandshakeError
from skywall.core.constants import ACTION_CONFIRM_TIMEOUT, CLIENT_RECONECT_INTERVAL
from skywall.core.config import config
from skywall.core.actions import parse_client_action
from skywall.core.reports import collect_report
from skywall.core.constants import CLIENT_ID_HEADER, CLIENT_TOKEN_HEADER
from skywall.actions.reports import SaveReportServerAction
from skywall.actions.labels import SaveLabelServerAction
from skywall.signals import (
        before_client_start, after_client_start, before_client_stop, after_client_stop,
        before_server_action_send, after_server_action_send, after_server_action_confirm,
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
        try:
            before_client_start.emit(client=self)
            headers = self._headers()
            self.session = ClientSession(loop=self.loop)
            self.socket = self.loop.run_until_complete(self.session.ws_connect(self.url, headers=headers))
            after_client_start.emit(client=self)
            return self
        except:
            self._close()
            raise

    def __exit__(self, exc_type, exc_val, exc_tb):
        before_client_stop.emit(client=self)
        self._close()
        after_client_stop.emit(client=self)

    def _close(self):
        if self.socket:
            self.loop.run_until_complete(self.socket.close(code=WSCloseCode.GOING_AWAY))
        if self.session:
            self.loop.run_until_complete(self.session.close())

    def _headers(self):
        headers = {}
        headers[CLIENT_ID_HEADER] = str(self.client_id)
        headers[CLIENT_TOKEN_HEADER] = str(self.client_token)
        return headers

    def _process_confirm(self, action):
        try:
            print('Received confirmation of action "{}" with payload: {}'.format(action.name, action.payload))
            after_server_action_confirm.emit(client=self, action=action)
        except Exception as e:
            print('Processing confirmation of action "{}" failed: {}'.format(action.name, e))

    def _process_action(self, action):
        try:
            print('Received action "{}" with payload: {}'.format(action.name, action.payload))
            before_client_action_receive.emit(client=self, action=action)
            action.execute(self)
            after_client_action_receive.emit(client=self, action=action)
            self.socket.send_json(action.send_confirm())
        except Exception as e:
            print('Executing action "{}" failed: {}'.format(action.name, e))

    def _process_message(self, msg):
        if msg.type != WSMsgType.TEXT:
            return
        try:
            action = parse_client_action(msg.data)
        except Exception as e:
            print('Invalid message received: {}; Error: {}'.format(msg.data, e))
            return
        if action.confirm:
            self._process_confirm(action)
        else:
            self._process_action(action)

    async def connect(self):
        self.send_label()
        self.send_reports()
        async for msg in self.socket:
            self._process_message(msg)

    def send_action(self, action):
        before_server_action_send.emit(client=self, action=action)
        self.socket.send_json(action.send())
        after_server_action_send.emit(client=self, action=action)

    async def check_send_action(self, action):
        future = asyncio.Future()
        sent_action = action

        def listener(client, action):
            if client is not self:
                return
            if action.name != sent_action.name:
                return
            if action.action_id != sent_action.action_id:
                return
            if not future.done():
                future.set_result(True)

        with after_server_action_confirm.connected(listener):
            self.send_action(sent_action)
            await asyncio.wait_for(future, ACTION_CONFIRM_TIMEOUT)

    def send_label(self):
        label = config.get('client.label')
        self.send_action(SaveLabelServerAction(label=label))

    def send_reports(self):
        report = collect_report()
        self.send_action(SaveReportServerAction(report=report))
        self.loop.call_later(self.reports_frequency, self.send_reports)


_client = None

def run_client():
    # pylint: disable=global-statement
    global _client
    loop = asyncio.get_event_loop()
    try:
        while True:
            try:
                with WebsocketClient(loop) as _client:
                    loop.run_until_complete(_client.connect())
            except ClientConnectionError as e:
                print('Connection to server failed: {}'.format(e))
            except WSServerHandshakeError as e:
                print('Connection to server failed: {}'.format(e))
            else:
                print('Connection to server failed: Connection closed by server.')
            finally:
                _client = None
            loop.run_until_complete(asyncio.sleep(CLIENT_RECONECT_INTERVAL))
    finally:
        loop.close()


def get_client():
    return _client
