from skywall.core.commands import AbstractCommand, register_command
from skywall.core.database import connect_database
from skywall.core.server import run_server
from skywall.core.config import config
from skywall.core.constants import SERVER_MODE


@register_command
class ServerCommand(AbstractCommand):
    name = 'server'
    help = 'Run skywall server'

    def run(self, args):
        config.validate(SERVER_MODE)
        connect_database()
        run_server()
