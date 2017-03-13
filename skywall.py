from core.config import config
from core.run import run
import settings
import commands
import models
import routes


if __name__ == '__main__':
    config.load()
    run()
