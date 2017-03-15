from skywall.core.config import config
from skywall.core.settings import AbstractSetting, register_setting


@register_setting
class ServerHostSetting(AbstractSetting):
    name = 'server.host'
    help = 'Host name the websocket server listens on (default: localhost)'

    @staticmethod
    def default():
        return 'localhost'

@register_setting
class ServerPortSetting(AbstractSetting):
    name = 'server.port'
    help = 'Port number the websocket server listens on (default: 9000)'

    @staticmethod
    def default():
        return 9000

    @staticmethod
    def coerce(value):
        return int(value)

@register_setting
class ServerPublicUrl(AbstractSetting):
    name = 'server.publicUrl'
    help = 'Websocket server public url (default: "http://HOST:PORT/")'

    @staticmethod
    def default():
        host = config.get('server.host')
        port = config.get('server.port')
        return 'http://{}:{}/'.format(host, port)
