from skywall.core.settings import AbstractSetting, register_setting


@register_setting
class DatabaseSetting(AbstractSetting):
    name = 'server.database'
    help = ('Database conection string" (default: "postgres://user:password@localhost/skywall")')

    @staticmethod
    def default():
        return 'postgres://user:password@localhost/skywall'
