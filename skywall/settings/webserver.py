from skywall.core.settings import AbstractSetting, register_setting


@register_setting
class WebserverHostSetting(AbstractSetting):
    name = 'webserver.host'
    help = 'Host name the web server listens on (default: localhost)'

    def default(self):
        return 'localhost'

@register_setting
class WebserverPortSetting(AbstractSetting):
    name = 'webserver.port'
    help = 'Port number the web server listens on (default: 8080)'

    def default(self):
        return 8080

    def coerce(self, value):
        return int(value)
