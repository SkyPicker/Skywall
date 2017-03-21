from skywall.core.settings import AbstractSetting, register_setting
from skywall.core.constants import SERVER_MODE


@register_setting
class DatabaseSetting(AbstractSetting):
    name = 'server.database'
    help = 'Database conection string, e.g. "postgres://user:password@localhost/skywall" (Required)'

    @staticmethod
    def default():
        return None

    @staticmethod
    def validate(value, mode):
        if mode is SERVER_MODE and not value:
            raise ValueError(
                'Database conection string is undefined.\n'
                '\n'
                'Please configure your database conection string to run the server. E.g.:\n'
                '\n'
                '    skywall.py set --server.database "postgres://user:password@localhost/skywall"\n'
                )
