commands = {}

def registerCommand(command):
    commands[command.name] = command
    return command


class AbstractCommand:
    name = None
    help = None

    @classmethod
    def arguments(cls, parser):
        pass

    def run(self):
        pass
