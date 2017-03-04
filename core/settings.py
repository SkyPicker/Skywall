settings = {}

def registerSetting(setting):
    settings[setting.name] = setting
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
    def validate():
        pass
