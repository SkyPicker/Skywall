from skywall.core.settings import AbstractSetting, register_setting


@register_setting
class ClientIdSetting(AbstractSetting):
    name = 'client.id'
    help = 'ID issued by the server to the client (default: None)'

    def default(self):
        return None

@register_setting
class ClientTokenSetting(AbstractSetting):
    name = 'client.token'
    help = 'Token issued by the server to the client (default: None)'

    def default(self):
        return None

@register_setting
class ClientLabelSetting(AbstractSetting):
    name = 'client.label'
    help = 'Label given to the client. Label may be set using this setting or via GUI (default: None)'

    def default(self):
        return None
