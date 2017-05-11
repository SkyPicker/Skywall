settings_registry = {}

def register_setting(setting):
    assert setting.name not in settings_registry
    settings_registry[setting.name] = setting()
    return setting


class AbstractSetting:
    name = None
    help = None

    def add_argument_params(self):
        return dict()

    def default(self):
        return None

    def coerce(self, old_value, value):
        return value

    def validate(self, value, mode):
        pass


class IntegerSetting(AbstractSetting):

    def coerce(self, old_value, value):
        return int(value)


class BooleanSetting(AbstractSetting):

    def add_argument_params(self):
        return dict(choices=['true', 'false', 'yes', 'no'], type=str.lower)

    def coerce(self, old_value, value):
        return value in ['true', 'yes']


class ListSetting(AbstractSetting):

    def add_argument_params(self):
        return dict(action='append')

    def coerce(self, old_value, value):
        items = list(old_value or [])
        for group in value:
            for item in group.split(','):
                item = item.strip()
                if item.startswith('~'):
                    if item[1:] in items:
                        items.remove(item[1:])
                elif item and item not in items:
                    items.append(item)
        return items
