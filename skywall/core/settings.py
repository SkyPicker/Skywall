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

    def coerce(self, value):
        return value

    def validate(self, value, mode):
        pass


class IntegerSetting(AbstractSetting):

    def coerce(self, value):
        return int(value)


class BooleanSetting(AbstractSetting):

    def add_argument_params(self):
        return dict(choices=['true', 'false', 'yes', 'no'], type=str.lower)

    def coerce(self, value):
        return value in ['true', 'yes']
