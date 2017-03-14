from core.settings import AbstractSetting, registerSetting


@registerSetting
class ClientIdSetting(AbstractSetting):
    name = 'client.id'
    help = 'ID issued by the server to the client (default: None)'

    @staticmethod
    def default():
        return None

@registerSetting
class ClientTokenSetting(AbstractSetting):
    name = 'client.token'
    help = 'Token issued by the server to the client (default: None)'

    @staticmethod
    def default():
        return None
