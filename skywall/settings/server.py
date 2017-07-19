from skywall.core.config import config
from skywall.core.settings import AbstractSetting, IntegerSetting, register_setting


@register_setting
class ServerHostSetting(AbstractSetting):
    name = 'server.host'
    help = 'Host name the websocket server listens on (default: 0.0.0.0)'

    def default(self):
        return '0.0.0.0'

@register_setting
class ServerPortSetting(IntegerSetting):
    name = 'server.port'
    help = 'Port number the websocket server listens on (default: 9000)'

    def default(self):
        return 9000

@register_setting
class ServerPublicUrlSetting(AbstractSetting):
    name = 'server.publicUrl'
    help = 'Websocket server public url (default: "http://HOST:PORT/")'

    def default(self):
        host = config.get('server.host')
        port = config.get('server.port')
        return 'http://{}:{}/'.format(host, port)
