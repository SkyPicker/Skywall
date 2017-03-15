from skywall.core.config import config
from skywall.core.settings import settings
from skywall.core.commands import AbstractCommand, register_command


def _setting_matches_args(name, args):
    if not args:
        return True
    name = '{}.'.format(name)
    for arg in args:
        arg = '{}.'.format(arg)
        if name.startswith(arg):
            return True
    return False

@register_command
class GetCommand(AbstractCommand):
    name = 'get'
    help = 'Get config settings'

    @staticmethod
    def arguments(parser):
        parser.add_argument('names', metavar='name', nargs='*',
                help='Name or prefix of names of settings to show')

    def run(self, args):
        for name in sorted(settings):
            if _setting_matches_args(name, args.names):
                value = config.get(name)
                print('{}: {}'.format(name, value))


@register_command
class SetCommand(AbstractCommand):
    name = 'set'
    help = 'Set config settings'

    @staticmethod
    def arguments(parser):
        group = parser.add_argument_group('settings')
        for name in sorted(settings):
            flag = '--{}'.format(name)
            metavar = name.rsplit('.', 1)[-1].upper()
            group.add_argument(flag, metavar=metavar, help=settings[name].help)

    def run(self, args):
        affected = []
        for name in settings:
            value = getattr(args, name)
            if value is not None:
                affected.append(name)
                config.set(name, value)
        config.save()
        for name in affected:
            value = config.get(name)
            print('{}: {}'.format(name, value))


@register_command
class UnsetCommand(AbstractCommand):
    name = 'unset'
    help = 'Unset config settings'

    @staticmethod
    def arguments(parser):
        parser.add_argument('names', metavar='name', nargs='+',
                help='Name or prefix of names of settings to unset')

    def run(self, args):
        for name in args.names:
            config.unset(name)
        config.save()
        for name in sorted(settings):
            if _setting_matches_args(name, args.names):
                value = config.get(name)
                print('{}: {}'.format(name, value))
