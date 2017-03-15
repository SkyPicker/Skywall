commands = {}


def register_command(command):
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
