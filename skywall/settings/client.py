from skywall.core.settings import AbstractSetting, register_setting


@register_setting
class ClientIdSetting(AbstractSetting):
    name = 'client.id'
    help = 'ID issued by the server to the client (default: None)'

    @staticmethod
    def default():
        return None

@register_setting
class ClientTokenSetting(AbstractSetting):
    name = 'client.token'
    help = 'Token issued by the server to the client (default: None)'

    @staticmethod
    def default():
        return None
