from skywall.core.run import run
import skywall.commands
import skywall.models
import skywall.reports
import skywall.api
import skywall.settings


def run_skywall():
    try:
        run()
    except KeyboardInterrupt:
        pass
