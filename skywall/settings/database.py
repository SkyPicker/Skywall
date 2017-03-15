from skywall.core.settings import AbstractSetting, register_setting


@register_setting
class DatabaseSetting(AbstractSetting):
    name = 'server.database'
    help = ('Database conection string, e.g. "postgresql://user:password@localhost/database" '
            '(default: "sqlite:///data.db")')

    @staticmethod
    def default():
        return 'sqlite:///data.db'
