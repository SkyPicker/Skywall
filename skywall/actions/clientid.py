from skywall.core.config import config
from skywall.core.actions import AbstractAction, register_client_action


@register_client_action
class SetIdClientAction(AbstractAction):
    name = 'set_id'

    def execute(self, connection):
        config.set('client.id', self.payload['client_id'])
        config.set('client.token', self.payload['client_token'])
        config.save()
