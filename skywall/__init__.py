from skywall.core.config import config
from skywall.core.run import run
import skywall.commands
import skywall.models
import skywall.settings
import skywall.routes


def run_skywall():
    config.load()
    run()
