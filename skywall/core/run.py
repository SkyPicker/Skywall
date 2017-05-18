import os
import argparse
from skywall.core.config import config
from skywall.core.modules import import_enabled_modules
from skywall.core.commands import commands_registry
from skywall.signals import before_command_run, after_command_run


def assert_virtualenv():
    if not os.environ.get('VIRTUAL_ENV'):
        raise NotImplementedError('Running Skywall outside a virtualenv is not supported')

def change_to_workdir():
    workdir = os.path.dirname(os.environ.get('VIRTUAL_ENV'))
    os.chdir(workdir)

def parse_args():
    desc = 'Client-Server based manager for connecting systems together and running tasks.'
    parser = argparse.ArgumentParser(description=desc)
    subparsers = parser.add_subparsers(dest='command', metavar='command')
    subparsers.required = True
    for command_name in sorted(commands_registry):
        command = commands_registry[command_name]
        subparser = subparsers.add_parser(command.name, help=command.help)
        command.arguments(subparser)
    args = parser.parse_args()
    return args

def run():
    assert_virtualenv()
    change_to_workdir()
    config.load()
    import_enabled_modules()
    args = parse_args()
    command = commands_registry[args.command]
    before_command_run.emit(command=command)
    command().run(args)
    after_command_run.emit(command=command)
