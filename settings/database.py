from core.config import config
from core.settings import AbstractSetting, registerSetting


@registerSetting
class DatabaseSetting(AbstractSetting):
    name = 'server.database'
    help = 'Database conection string, e.g. "postgresql://user:password@localhost/database" (default: "sqlite:///data.db")'

    @staticmethod
    def default():
        return 'sqlite:///data.db'
