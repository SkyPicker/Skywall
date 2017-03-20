from skywall.core.settings import AbstractSetting, register_setting


@register_setting
class ClientReportsSetting(AbstractSetting):
    name = 'client.reports.frequency'
    help = 'Frequency of client reports in seconds (default: 5 minutes)'

    @staticmethod
    def default():
        return 5 * 60

    @staticmethod
    def coerce(value):
        return int(value)
