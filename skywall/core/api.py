from functools import wraps
from collections import namedtuple
from aiohttp.web import HTTPBadRequest, HTTPNotFound
from skywall.core.signals import Signal


Api = namedtuple('Api', ['method', 'path', 'handler'])
api_registry = []

before_api_call = Signal('before_api_call')
after_api_call = Signal('after_api_call')


def register_api(method, path, before_call, after_call):
    def decorator(handler):
        @wraps(handler)
        async def signaled_handler(request):
            before_api_call.emit(api=api, request=request)
            before_call.emit(api=api, request=request)
            try:
                response = await handler(request)
                after_call.emit(api=api, request=request, response=response, exception=None)
                after_api_call.emit(api=api, request=request, response=response, exception=None)
                return response
            except Exception as e:
                after_call.emit(api=api, request=request, response=None, exception=e)
                after_api_call.emit(api=api, request=request, response=None, exception=e)
                raise
        api = Api(method, path, signaled_handler)
        api_registry.append(api)
        return signaled_handler
    return decorator


async def parse_json_body(request):
    try:
        return await request.json()
    except Exception as e:
        raise HTTPBadRequest(reason='Invalid JSON body: {}'.format(e))

def parse_id_path_param(request, param):
    try:
        return int(request.match_info.get(param))
    except:
        raise HTTPBadRequest(reason='Invalid {} in path'.format(param))

def parse_obj_path_param(request, param, session, model):
    obj_id = parse_id_path_param(request, param)
    try:
        return session.query(model).filter(model.id == obj_id).one()
    except:
        raise HTTPNotFound(reason='Requested {} not found'.format(param))

def parse_string_path_param(request, param):
    try:
        return str(request.match_info.get(param))
    except:
        raise HTTPBadRequest(reason='Invalid {} in path'.format(param))

def parse_enum_path_param(request, param, enum):
    value = parse_string_path_param(request, param)
    try:
        return enum[value]
    except:
        raise HTTPBadRequest(reason='{} must be {}'.format(param, enum.__name__))

def assert_request_param_is_required(param, values):
    try:
        return values[param]
    except:
        raise HTTPBadRequest(reason='{} is required'.format(param))

def assert_request_param_is_string(param, values):
    value = assert_request_param_is_required(param, values)
    if not isinstance(value, str):
        raise HTTPBadRequest(reason='{} must be a string'.format(param))
    return value

def assert_request_param_is_boolean(param, values):
    value = assert_request_param_is_required(param, values)
    if not isinstance(value, bool):
        raise HTTPBadRequest(reason='{} must be boolean'.format(param))
    return value

def assert_request_param_is_enum(param, values, enum):
    value = assert_request_param_is_required(param, values)
    try:
        return enum[value]
    except:
        raise HTTPBadRequest(reason='{} must be {}'.format(param, enum.__name__))

def assert_request_param_is_entity(param, values, session, model):
    value = assert_request_param_is_required(param, values)
    try:
        return session.query(model).filter(model.id == value).one()
    except:
        raise HTTPBadRequest(reason='{} must be {} id'.format(param, model.__name__))
