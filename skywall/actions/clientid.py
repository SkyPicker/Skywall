from skywall.core.config import config
from skywall.core.actions import AbstractClientAction, register_client_action


@register_client_action
class SetIdClientAction(AbstractClientAction):
    name = 'set-id'

    def execute(self, client):
        config.set('client.id', self.payload['client_id'])
        config.set('client.token', self.payload['client_token'])
        config.save()
