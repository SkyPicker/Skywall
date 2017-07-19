from skywall.core.settings import AbstractSetting, IntegerSetting, register_setting


@register_setting
class WebserverHostSetting(AbstractSetting):
    name = 'webserver.host'
    help = 'Host name the web server listens on (default: 0.0.0.0)'

    def default(self):
        return '0.0.0.0'

@register_setting
class WebserverPortSetting(IntegerSetting):
    name = 'webserver.port'
    help = 'Port number the web server listens on (default: 8080)'

    def default(self):
        return 8080
