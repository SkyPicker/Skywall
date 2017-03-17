commands = {}


def register_command(command):
    assert command.name not in commands
    commands[command.name] = command
    return command


class AbstractCommand:
    name = None
    help = None

    @staticmethod
    def arguments(parser):
        pass

    def run(self, args):
        pass
