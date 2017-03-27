from skywall.core.config import config
from skywall.core.settings import AbstractSetting, IntegerSetting, register_setting


@register_setting
class WebpackHostSetting(AbstractSetting):
    name = 'webpack.host'
    help = 'Host name the webpack hot server listens on (default: the same as webserver host)'

    def default(self):
        return config.get('webserver.host')

@register_setting
class WebpackPortSetting(IntegerSetting):
    name = 'webpack.port'
    help = 'Port number the webpack hot server listens on (default: 8081)'

    def default(self):
        return 8081
