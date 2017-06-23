from skywall.core.commands import AbstractCommand, register_command
from skywall.core.database import connect_database
from skywall.core.server import run_server
from skywall.core.config import config
from skywall.core.constants import SERVER_MODE
from skywall.core.signals import Signal
from skywall.core.frontend import install_frontend, build_frontend


@register_command
class InstallCommand(AbstractCommand):
    name = 'install'
    help = 'Install Skywall frontend npm dependencies'
    before_run = Signal('InstallCommand.before_run')
    after_run = Signal('InstallCommand.after_run')

    def run(self, args):
        install_frontend()


@register_command
class BuildCommand(AbstractCommand):
    name = 'build'
    help = 'Build Skywall frontend'
    before_run = Signal('BuildCommand.before_run')
    after_run = Signal('BuildCommand.after_run')

    def run(self, args):
        build_frontend()


@register_command
class ServerCommand(AbstractCommand):
    name = 'server'
    help = 'Run skywall server'
    before_run = Signal('ServerCommand.before_run')
    after_run = Signal('ServerCommand.after_run')

    def run(self, args):
        config.validate(SERVER_MODE)
        connect_database()
        run_server()
