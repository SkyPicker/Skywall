import argparse
from skywall.core.commands import commands_registry
from skywall.signals import before_command_run, after_command_run


def run():
    desc = 'Client-Server based manager for connecting systems together and running tasks.'
    parser = argparse.ArgumentParser(description=desc)
    subparsers = parser.add_subparsers(dest='command', metavar='command')
    subparsers.required = True
    for command in commands_registry.values():
        subparser = subparsers.add_parser(command.name, help=command.help)
        command.arguments(subparser)

    args = parser.parse_args()
    command = commands_registry[args.command]
    before_command_run.emit(command=command)
    command().run(args)
    after_command_run.emit(command=command)
