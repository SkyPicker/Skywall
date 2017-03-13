from core.config import config
from core.settings import AbstractSetting, registerSetting


@registerSetting
class WebserverHostSetting(AbstractSetting):
    name = 'webserver.host'
    help = 'Host name the web server listens on (default: localhost)'

    @staticmethod
    def default():
        return 'localhost'

@registerSetting
class WebserverPortSetting(AbstractSetting):
    name = 'webserver.port'
    help = 'Port number the web server listens on (default: 8080)'

    @staticmethod
    def default():
        return 8080

    @staticmethod
    def coerce(value):
        return int(value)
