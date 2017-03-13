from core.commands import AbstractCommand, registerCommand
from core.database import connectDatabase
from core.server import runServer


@registerCommand
class ServerCommand(AbstractCommand):
    name = 'server'
    help = 'Run skywall server'

    def run(self, args):
        connectDatabase()
        runServer()
