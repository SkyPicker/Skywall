from collections import namedtuple


Route = namedtuple('Route', ['method', 'path', 'handler'])
routes_registry = []

def register_route(method, path):
    def decorator(handler):
        routes_registry.append(Route(method, path, handler))
        return handler
    return decorator
