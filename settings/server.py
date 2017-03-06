from core.config import config
from core.settings import AbstractSetting, registerSetting


@registerSetting
class ServerHostSetting(AbstractSetting):
    name = 'server.host'
    help = 'Host name the server listens on (default: localhost)'

    @staticmethod
    def default():
        return 'localhost'

@registerSetting
class ServerPortSetting(AbstractSetting):
    name = 'server.port'
    help = 'Port number the server listens on (default: 9000)'

    @staticmethod
    def default():
        return 9000

    @staticmethod
    def coerce(value):
        return int(value)

@registerSetting
class ServerPublicUrl(AbstractSetting):
    name = 'server.publicUrl'
    help = 'Server public url (default: "ws://HOST:PORT/")'

    @staticmethod
    def default():
        host = config.get('server.host')
        port = config.get('server.port')
        return 'ws://{}:{}/'.format(host, port)
