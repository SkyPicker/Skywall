from skywall.core.database import Session
from skywall.core.actions import AbstractServerAction, register_server_action


@register_server_action
class SaveLabelServerAction(AbstractServerAction):
    name = 'save-label'

    def execute(self, connection, client):
        with Session() as session:
            session.add(client)
            client.label = self.payload['label'] or ''
