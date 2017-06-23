from skywall.core.commands import AbstractCommand, register_command
from skywall.core.client import run_client
from skywall.core.config import config
from skywall.core.constants import CLIENT_MODE
from skywall.core.signals import Signal


@register_command
class ClientCommand(AbstractCommand):
    name = 'client'
    help = 'Run skywall client'
    before_run = Signal('ClientCommand.before_run')
    after_run = Signal('ClientCommand.after_run')

    def run(self, args):
        config.validate(CLIENT_MODE)
        run_client()
