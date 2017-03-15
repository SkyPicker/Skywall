from ruamel import yaml
from skywall.core.settings import settings


class Config:
    data = None

    def load(self):
        try:
            with open('config.yaml', 'r') as f:
                self.data = yaml.round_trip_load(f)
        except FileNotFoundError:
            self.data = None
        self.validate()

    def save(self):
        self.validate()
        with open('config.yaml', 'w') as f:
            yaml.round_trip_dump(self.data, f)

    def validate(self):
        for name in settings:
            settings[name].validate()

    def get(self, name):
        setting = settings[name] # To make sure we get only registered settings
        data = self.data
        parts = name.split('.')
        for part in parts:
            if not isinstance(data, dict) or part not in data:
                return setting.default()
            data = data[part]
        return data

    def set(self, name, value):
        setting = settings[name] # To make sure we set only registered settings
        if not isinstance(self.data, dict):
            self.data = {}
        data = self.data
        parts = name.split('.')
        for part in parts[:-1]:
            if part not in data or not isinstance(data[part], dict):
                data[part] = {}
            data = data[part]
        data[parts[-1]] = setting.coerce(value)

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
