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
        try:
            return int(value)
        except ValueError:
            raise ValueError('Setting "{}" must be an integer'.format(self.name))


class BooleanSetting(AbstractSetting):
    true_choices = ['true', 'yes']
    false_choices = ['false', 'no']
    all_choices = true_choices + false_choices

    def add_argument_params(self):
        return dict(choices=self.all_choices, type=str.lower)

    def coerce(self, old_value, value):
        if value.lower() in self.true_choices:
            return True
        if value.lower() in self.false_choices:
            return False
        raise ValueError('Setting "{}" must be one of: {}'.format(self.name, self.all_choices))


class ListSetting(AbstractSetting):

    def add_argument_params(self):
        return dict(action='append')

    def coerce(self, old_value, value):
        items = list(old_value or [])
        if isinstance(value, str):
            value = [value]
        for group in value:
            for item in group.split(','):
                item = item.strip()
                if item.startswith('~'):
                    if item[1:] in items:
                        items.remove(item[1:])
                elif item and item not in items:
                    items.append(item)
        return items

class IdentifierListSetting(ListSetting):

    def coerce(self, old_value, value):
        items = super().coerce(old_value, value)
        for item in items:
            if not item.isidentifier():
                raise ValueError('Setting "{}" may contain only identifiers'.format(self.name))
        return items
