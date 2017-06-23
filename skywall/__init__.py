from skywall.core.run import run
import skywall.actions
import skywall.api
import skywall.commands
import skywall.models
import skywall.reports
import skywall.settings


def run_skywall():
    try:
        run()
    except KeyboardInterrupt:
        pass
