from skywall.core.database import create_session
from skywall.core.signals import Signal
from skywall.core.actions import AbstractServerAction, register_server_action
from skywall.core.reports import reports_registry
from skywall.models.reports import (
        Report, ReportValue,
        before_report_create, after_report_create, before_report_value_create, after_report_value_create,
        )

from skywall.models.clients import Client


@register_server_action
class SaveReportServerAction(AbstractServerAction):
    name = 'save-report'
    before_send = Signal('SaveReportServerAction.before_send')
    after_send = Signal('SaveReportServerAction.after_send')
    before_receive = Signal('SaveReportServerAction.before_receive')
    after_receive = Signal('SaveReportServerAction.after_receive')
    after_confirm = Signal('SaveReportServerAction.after_confirm')

    def execute(self, connection):
        with create_session() as session:
            client = session.query(Client).filter(Client.id == connection.client_id).first()
            report = Report(client=client)
            before_report_create.emit(session=session, report=report)
            session.add(report)
            session.flush()
            after_report_create.emit(session=session, report=report)

            values = self.payload['report']
            for name in reports_registry:
                value = values.get(name, None)
                before_report_value_create.emit(session=session, report_value=value)
                session.add(ReportValue(report=report, name=name, value=value))
                session.flush()
                after_report_value_create.emit(session=session, report_value=value)
