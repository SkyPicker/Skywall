from core.settings import AbstractSetting, register_setting


@register_setting
class WebserverHostSetting(AbstractSetting):
    name = 'webserver.host'
    help = 'Host name the web server listens on (default: localhost)'

    @staticmethod
    def default():
        return 'localhost'

@register_setting
class WebserverPortSetting(AbstractSetting):
    name = 'webserver.port'
    help = 'Port number the web server listens on (default: 8080)'

    @staticmethod
    def default():
        return 8080

    @staticmethod
    def coerce(value):
        return int(value)
