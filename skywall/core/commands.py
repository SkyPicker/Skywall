commands_registry = {}


def register_command(command):
    assert command.name not in commands_registry
    commands_registry[command.name] = command
    return command


class AbstractCommand:
    name = None
    help = None

    @staticmethod
    def arguments(parser):
        pass

    def run(self, args):
        pass
