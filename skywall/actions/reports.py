from skywall.core.database import create_session
from skywall.core.actions import AbstractServerAction, register_server_action
from skywall.core.reports import reports_registry
from skywall.models.reports import Report, ReportValue
from skywall.models.client import Client


@register_server_action
class SaveReportServerAction(AbstractServerAction):
    name = 'save-report'

    def execute(self, connection):
        with create_session() as session:
            client = session.query(Client).filter(Client.id == connection.client_id).first()
            report = Report(client=client)
            session.add(report)
            session.flush()

            values = self.payload['report']
            for name in reports_registry:
                value = values.get(name, None)
                session.add(ReportValue(report=report, name=name, value=value))
