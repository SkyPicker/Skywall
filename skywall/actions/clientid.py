from skywall.core.config import config
from skywall.core.signals import Signal
from skywall.core.actions import AbstractClientAction, register_client_action


@register_client_action
class SetIdClientAction(AbstractClientAction):
    name = 'set-id'
    before_send = Signal('SetIdClientAction.before_send')
    after_send = Signal('SetIdClientAction.after_send')
    before_receive = Signal('SetIdClientAction.before_receive')
    after_receive = Signal('SetIdClientAction.after_receive')
    after_confirm = Signal('SetIdClientAction.after_confirm')

    def execute(self, client):
        config.set('client.id', self.payload['client_id'])
        config.set('client.token', self.payload['client_token'])
        config.save()
