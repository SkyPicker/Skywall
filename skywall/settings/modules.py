from skywall.core.settings import ListSetting, register_setting
from skywall.core.run import import_modules


@register_setting
class ModulesSetting(ListSetting):
    name = 'modules'
    help = (
        'Enable a Skywall module. Separate modules with a comma or use multiple options '
        'to enable multiple modules. Use ~MODULE to disable a module.'
        )

    def default(self):
        return None

    def coerce(self, old_value, value):
        value = super().coerce(old_value, value)
        import_modules(value)
        return value
