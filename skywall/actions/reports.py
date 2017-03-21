from skywall.core.database import Session
from skywall.core.actions import AbstractServerAction, register_server_action
from skywall.core.reports import reports_registry
from skywall.models.reports import Report, ReportValue


@register_server_action
class SaveReportServerAction(AbstractServerAction):
    name = 'save-report'

    def execute(self, connection, client):
        session = Session()
        report = Report(client=client)
        session.add(report)
        session.flush()

        values = self.payload['report']
        for name in reports_registry:
            value = values.get(name, None)
            session.add(ReportValue(report=report, name=name, value=value))
        session.commit()
        session.close()
