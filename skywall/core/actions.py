import json
from skywall.core.utils import randomstring

client_actions_registry = {}
server_actions_registry = {}


def _register_action(actions_registry, action):
    assert action.name not in actions_registry
    actions_registry[action.name] = action
    return action

def register_client_action(action):
    return _register_action(client_actions_registry, action)

def register_server_action(action):
    return _register_action(server_actions_registry, action)


def _parse_action(receiving_actions_registry, sending_actions_registry, data):
    data = json.loads(data)
    confirm = bool(data.get('confirm'))
    actions_registry = sending_actions_registry if confirm else receiving_actions_registry
    klass = actions_registry[data['action']]
    action = klass(**data['payload'])
    action.action_id = data['action_id']
    action.confirm = confirm
    return action

def parse_client_action(data):
    return _parse_action(client_actions_registry, server_actions_registry, data)

def parse_server_action(data):
    return _parse_action(server_actions_registry, client_actions_registry, data)


class _AbstractAction:
    name = None
    before_send = None
    after_send = None
    before_receive = None
    after_receive = None
    after_confirm = None

    def __init__(self, **payload):
        self.payload = payload
        self.action_id = randomstring(32)
        self.confirm = False

    def send(self):
        return dict(action=self.name, payload=self.payload, action_id=self.action_id)

    def send_confirm(self):
        return dict(action=self.name, payload=self.payload, action_id=self.action_id, confirm=True)


class AbstractClientAction(_AbstractAction):

    def execute(self, client):
        pass


class AbstractServerAction(_AbstractAction):

    def execute(self, connection):
        pass
