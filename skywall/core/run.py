import os
import sys
import argparse
import importlib
from skywall.core.config import config
from skywall.core.commands import commands_registry
from skywall.signals import before_command_run, after_command_run


def _get_skywall_dir():
    # Use the repository root if running a cloned repository
    if os.path.isfile(os.path.join(os.path.dirname(__file__), '../../package.json')):
        return os.path.join(os.path.dirname(__file__), '../../')

    # Use env/share/skywall if running an installed package
    if hasattr(sys, 'real_prefix'):
        return os.path.join(sys.prefix, 'share/skywall')
    if hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix:
        return os.path.join(sys.prefix, 'share/skywall')
    raise NotImplementedError('Running Skywall outside a virtualenv is not supported')

def chdir():
    os.chdir(_get_skywall_dir())

def import_modules(modules):
    if not modules:
        return
    for module in modules:
        try:
            importlib.import_module(module)
        except ImportError as e:
            print('Warning: Enabling module "{}" failed: {}'.format(module, e))

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
    import_modules(config.get('modules'))
    args = parse_args()
    command = commands_registry[args.command]
    before_command_run.emit(command=command)
    command().run(args)
    after_command_run.emit(command=command)
