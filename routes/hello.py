import aiohttp.web
from core.routes import register_route


@register_route('GET', '/hello/{name}')
async def hello(request):
    """
    ---
    tags:
    - Hello
    summary: Hello world
    description: Hello world
    produces:
    - application/json
    parameters:
    - name: name
      in: path
      description: Name to say hello to
      required: true
      type: string
    responses:
      "200":
        description: successful operation
        schema:
          type: object
          properties:
            text:
              type: string
    """
    name = request.match_info.get('name', 'Unknown')
    return aiohttp.web.json_response({'text': 'Hello ' + name})
