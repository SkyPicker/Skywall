from core.commands import AbstractCommand, register_command
from core.database import connect_database
from core.server import run_server


@register_command
class ServerCommand(AbstractCommand):
    name = 'server'
    help = 'Run skywall server'

    def run(self, args):
        connect_database()
        run_server()
