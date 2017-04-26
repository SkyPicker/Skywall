from skywall.core.config import config
from skywall.core.database import create_session
from skywall.core.actions import (
        AbstractServerAction, AbstractClientAction, register_server_action, register_client_action
        )
from skywall.models.client import Client


@register_server_action
class SaveLabelServerAction(AbstractServerAction):
    name = 'save-label'

    def execute(self, connection):
        with create_session() as session:
            client = session.query(Client).filter(Client.id == connection.client_id).first()
            client.label = self.payload['label'] or ''

@register_client_action
class SetLabelClientAction(AbstractClientAction):
    name = 'set-label'

    def execute(self, client):
        label = self.payload['label']
        config.set('client.label', label)
        config.save()
