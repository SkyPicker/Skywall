settings_registry = {}

def register_setting(setting):
    assert setting.name not in settings_registry
    settings_registry[setting.name] = setting()
    return setting

class AbstractSetting:
    name = None
    help = None

    def default(self):
        return None

    def coerce(self, value):
        return value

    def validate(self, value, mode):
        pass
