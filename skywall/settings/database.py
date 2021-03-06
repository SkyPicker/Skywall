from skywall.core.settings import AbstractSetting, register_setting
from skywall.core.constants import SERVER_MODE


@register_setting
class DatabaseSetting(AbstractSetting):
    name = 'server.database'
    help = 'Database conection string, e.g. "postgres://user:password@host/skywall" (Required)'

    def default(self):
        return None

    def validate(self, value, mode):
        if mode is SERVER_MODE and not value:
            raise ValueError(
                'Database conection string is undefined.\n'
                '\n'
                'Please configure your database conection string to run the server. E.g.:\n'
                '\n'
                '    $ skywall set --server.database "postgres://user:password@host/skywall"\n'
                )
