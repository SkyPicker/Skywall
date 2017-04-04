import socket
from skywall.core.reports import AbstractReport, register_report


@register_report
class HostnameReport(AbstractReport):
    name = 'hostname'
    label = 'Hostname'

    def collect(self):
        return socket.gethostname()
