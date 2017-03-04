import argparse
from core.commands import commands


def run():
    desc = 'Client-Server based manager for connecting systems together and running tasks.'
    parser = argparse.ArgumentParser(description=desc)
    subparsers = parser.add_subparsers(dest='command', metavar='command')
    subparsers.required = True
    for command in commands.values():
        subparser = subparsers.add_parser(command.name, help=command.help)
        command.arguments(subparser)

    args = parser.parse_args()
    command = commands[args.command]
    command().run(args)
