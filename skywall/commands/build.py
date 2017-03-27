import os
import subprocess
from skywall.core.config import config
from skywall.core.commands import AbstractCommand, register_command


@register_command
class BuildCommand(AbstractCommand):
    name = 'build'
    help = 'Build skywall frontend'

    def run(self, args):
        host = config.get('webpack.host')
        port = config.get('webpack.port')
        env = dict(os.environ, WEBPACK_HOST=host, WEBPACK_PORT=str(port))
        subprocess.run(['npm', 'run', 'build'], env=env)
