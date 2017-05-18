from skywall.core.commands import AbstractCommand, register_command
from skywall.core.database import connect_database
from skywall.core.server import run_server
from skywall.core.config import config
from skywall.core.constants import SERVER_MODE
from skywall.core.frontend import install_frontend, build_frontend


@register_command
class InstallCommand(AbstractCommand):
    name = 'install'
    help = 'Install Skywall frontend npm dependencies'

    def run(self, args):
        config.validate(SERVER_MODE)
        install_frontend()


@register_command
class BuildCommand(AbstractCommand):
    name = 'build'
    help = 'Build Skywall frontend'

    def run(self, args):
        config.validate(SERVER_MODE)
        build_frontend()


@register_command
class ServerCommand(AbstractCommand):
    name = 'server'
    help = 'Run skywall server'

    def run(self, args):
        config.validate(SERVER_MODE)
        connect_database()
        run_server()
