import importlib
from skywall.core.config import config


def import_modules(modules):
    res = []
    for module in modules or []:
        try:
            res.append(importlib.import_module(module))
        except ImportError as e:
            print('Warning: Importing module "{}" failed: {}'.format(module, e))
    return res

def import_enabled_modules():
    modules = config.get('modules')
    return import_modules(modules)
