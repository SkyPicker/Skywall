from skywall.core.actions import AbstractAction, register_client_action, register_server_action, send_action


@register_client_action
class HelloClientAction(AbstractAction):
    name = 'hello'

    def execute(self, connection):
        pass


@register_server_action
class HelloServerAction(AbstractAction):
    name = 'hello'

    def execute(self, connection):
        send_action(connection, HelloClientAction(text=self.payload['text']))
