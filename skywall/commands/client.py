from skywall.core.commands import AbstractCommand, register_command
from skywall.core.client import run_client
from skywall.core.config import config
from skywall.core.constants import CLIENT_MODE


@register_command
class ClientCommand(AbstractCommand):
    name = 'client'
    help = 'Run skywall client'

    def run(self, args):
        config.validate(CLIENT_MODE)
        run_client()
