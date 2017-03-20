import uptime
from skywall.core.reports import AbstractReport, register_report


@register_report
class UptimeReport(AbstractReport):
    name = 'uptime'

    @staticmethod
    def collect():
        return uptime.uptime()
