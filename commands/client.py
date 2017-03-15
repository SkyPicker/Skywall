from core.commands import AbstractCommand, register_command
from core.client import run_client


@register_command
class ClientCommand(AbstractCommand):
    name = 'client'
    help = 'Run skywall client'

    def run(self, args):
        run_client()
