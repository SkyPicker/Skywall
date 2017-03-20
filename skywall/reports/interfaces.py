import netifaces
import pyroute2
from skywall.core.reports import AbstractReport, register_report


@register_report
class InterfacesReport(AbstractReport):
    name = 'interfaces'

    @staticmethod
    def collect():
        return netifaces.interfaces()


@register_report
class IpAddressesReport(AbstractReport):
    name = 'ip-addresses'

    @staticmethod
    def collect():
        res = []
        for interface in netifaces.interfaces():
            for address in netifaces.ifaddresses(interface).get(netifaces.AF_INET, []):
                addr = address.get('addr')
                if addr:
                    res.append(addr)
        return res


@register_report
class PrimaryIpAddressReport(AbstractReport):
    name = 'primary-ip-address'

    @staticmethod
    def collect():
        ipr = pyroute2.IPRoute()
        route = ipr.route('get', dst='8.8.8.8')
        try:
            attrs = dict(route[0]['attrs'])
            addr = attrs['RTA_PREFSRC']
            return addr
        except (IndexError, KeyError, ValueError):
            return None
