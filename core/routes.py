from collections import namedtuple


Route = namedtuple('Route', ['method', 'path', 'handler'])
routes = []

def registerRoute(method, path):
    def decorator(handler):
        routes.append(Route(method, path, handler))
        return handler
    return decorator
