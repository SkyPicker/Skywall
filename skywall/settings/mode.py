from skywall.core.settings import BooleanSetting, register_setting


@register_setting
class DevelSetting(BooleanSetting):
    name = 'devel'
    help = 'True/false flag whether running in the development mode (default: False)'

    def default(self):
        return False
