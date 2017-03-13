from core.commands import AbstractCommand, registerCommand
from core.client import runClient


@registerCommand
class ClientCommand(AbstractCommand):
    name = 'client'
    help = 'Run skywall client'

    def run(self, args):
        runClient()
