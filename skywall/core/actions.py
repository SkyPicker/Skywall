import json

client_actions = {}
server_actions = {}


def register_client_action(action):
    assert action.name not in client_actions
    client_actions[action.name] = action
    return action

def register_server_action(action):
    assert action.name not in server_actions
    server_actions[action.name] = action
    return action

def send_action(connection, action):
    connection.send_json(dict(action=action.name, payload=action.payload))

def parse_client_action(data):
    data = json.loads(data)
    klass = client_actions[data['action']]
    action = klass(**data['payload'])
    return action

def parse_server_action(data):
    data = json.loads(data)
    klass = server_actions[data['action']]
    action = klass(**data['payload'])
    return action

class AbstractClientAction:
    name = None

    def __init__(self, **payload):
        self.payload = payload

    def execute(self, connection):
        pass

class AbstractServerAction:
    name = None

    def __init__(self, **payload):
        self.payload = payload

    def execute(self, connection, client):
        pass
