from skywall.core.settings import IntegerSetting, register_setting


@register_setting
class ClientReportsSetting(IntegerSetting):
    name = 'client.reports.frequency'
    help = 'Frequency of client reports in seconds (default: 5 minutes)'

    def default(self):
        return 5 * 60
