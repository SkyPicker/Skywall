from skywall.core.config import config
from skywall.core.signals import Signal
from skywall.core.database import create_session
from skywall.core.actions import (
        AbstractServerAction, AbstractClientAction, register_server_action, register_client_action
        )
from skywall.models.clients import Client, before_client_update, after_client_update


@register_server_action
class SaveLabelServerAction(AbstractServerAction):
    name = 'save-label'
    before_send = Signal('SaveLabelServerAction.before_send')
    after_send = Signal('SaveLabelServerAction.after_send')
    before_receive = Signal('SaveLabelServerAction.before_receive')
    after_receive = Signal('SaveLabelServerAction.after_receive')
    after_confirm = Signal('SaveLabelServerAction.after_confirm')

    def execute(self, connection):
        with create_session() as session:
            client = session.query(Client).filter(Client.id == connection.client_id).first()
            client.label = self.payload['label'] or ''
            before_client_update.emit(session=session, client=client)
            session.flush()
            after_client_update.emit(session=session, client=client)

@register_client_action
class SetLabelClientAction(AbstractClientAction):
    name = 'set-label'
    before_send = Signal('SetLabelClientAction.before_send')
    after_send = Signal('SetLabelClientAction.after_send')
    before_receive = Signal('SetLabelClientAction.before_receive')
    after_receive = Signal('SetLabelClientAction.after_receive')
    after_confirm = Signal('SetLabelClientAction.after_confirm')

    def execute(self, client):
        label = self.payload['label']
        config.set('client.label', label)
        config.save()
