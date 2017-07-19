from skywall.core.settings import IdentifierListSetting, register_setting


@register_setting
class ModulesSetting(IdentifierListSetting):
    name = 'modules'
    help = (
        'Enable a Skywall module. Separate modules with a comma or use multiple options '
        'to enable multiple modules. Use ~MODULE to disable a module.'
        )

    def default(self):
        return None
