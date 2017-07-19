import os
import re
from ruamel import yaml
from skywall.core.settings import settings_registry
from skywall.core.signals import Signal


before_config_load = Signal('before_config_load')
after_config_load = Signal('after_config_load')
before_config_save = Signal('before_config_save')
after_config_save = Signal('after_config_save')


class Config:
    data = None

    def load(self):
        before_config_load.emit(config=self)
        try:
            with open('config.yaml', 'r') as f:
                self.data = yaml.round_trip_load(f)
        except FileNotFoundError:
            self.data = None
        after_config_load.emit(config=self)

    def save(self):
        before_config_save.emit(config=self)
        with open('config.yaml', 'w') as f:
            yaml.round_trip_dump(self.data, f)
        after_config_save.emit(config=self)

    def validate(self, mode):
        for name in settings_registry:
            setting = settings_registry[name]
            value = self.get(name)
            setting.validate(value, mode)

    def get(self, name):
        setting = settings_registry[name] # To make sure we get only registered settings
        data = self.data
        parts = name.split('.')
        for part in parts:
            if not isinstance(data, dict) or part not in data:
                try:
                    envname = re.sub(r'\W', '_', 'skywall.' + name)
                    value = os.environ[envname]
                    return setting.coerce(None, value)
                except KeyError:
                    return setting.default()
            data = data[part]
        return data

    def set(self, name, value):
        setting = settings_registry[name] # To make sure we set only registered settings
        if not isinstance(self.data, dict):
            self.data = {}
        data = self.data
        parts = name.split('.')
        for part in parts[:-1]:
            if part not in data or not isinstance(data[part], dict):
                data[part] = {}
            data = data[part]
        old_value = data.get(parts[-1])
        data[parts[-1]] = setting.coerce(old_value, value)

    def unset(self, name):
        if not isinstance(self.data, dict):
            return
        data = self.data
        parts = name.split('.')
        for part in parts[:-1]:
            if part not in data or not isinstance(data[part], dict):
                return
            data = data[part]
        data.pop(parts[-1], None)


config = Config()
