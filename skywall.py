from core.config import config
from core.run import run
import settings
import commands
import models


if __name__ == '__main__':
    config.load()
    run()
