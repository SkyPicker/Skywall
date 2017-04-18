from collections import namedtuple
from aiohttp.web import HTTPBadRequest, HTTPNotFound
from skywall.signals import before_api_handler, after_api_handler


Api = namedtuple('Api', ['method', 'path', 'handler'])
api_registry = []

def register_api(method, path):
    def decorator(handler):
        def signaled_handler(request):
            before_api_handler.emit(api=api, request=request)
            try:
                response = handler(request)
                after_api_handler.emit(api=api, request=request, response=response)
                return response
            except Exception as e:
                after_api_handler.emit(api=api, request=request, exception=e)
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

def assert_request_param_is_string(param, value):
    if not isinstance(value, str):
        raise HTTPBadRequest(reason='{} must be a string'.format(param))
    return value
