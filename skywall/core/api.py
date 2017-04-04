from collections import namedtuple


Api = namedtuple('Api', ['method', 'path', 'handler'])
api_registry = []

def register_api(method, path):
    def decorator(handler):
        api_registry.append(Api(method, path, handler))
        return handler
    return decorator
