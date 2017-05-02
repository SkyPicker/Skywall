from skywall.core.config import config
from skywall.core.run import chdir, run
import skywall.commands
import skywall.models
import skywall.reports
import skywall.api
import skywall.settings


def run_skywall():
    try:
        chdir()
        config.load()
        run()
    except KeyboardInterrupt:
        pass
