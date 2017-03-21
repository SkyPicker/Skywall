settings_registry = {}

def register_setting(setting):
    assert setting.name not in settings_registry
    settings_registry[setting.name] = setting
    return setting

class AbstractSetting:
    name = None
    help = None

    @staticmethod
    def default():
        return None

    @staticmethod
    def coerce(value):
        return value

    @staticmethod
    def validate(value, mode):
        pass
