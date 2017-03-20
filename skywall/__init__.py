from skywall.core.config import config
from skywall.core.run import run
import skywall.commands
import skywall.models
import skywall.reports
import skywall.routes
import skywall.settings


def run_skywall():
    config.load()
    run()
