import re
from aiohttp.web import json_response, HTTPBadRequest
from sqlalchemy.exc import IntegrityError
from skywall.core.signals import Signal
from skywall.core.api import register_api, parse_json_body, assert_request_param_is_string
from skywall.core.database import create_session
from skywall.models.groups import Group, before_group_create, after_group_create


before_add_group = Signal('before_add_group')
after_add_group = Signal('after_add_group')


@register_api('POST', '/groups', before_add_group, after_add_group)
async def add_group(request):
    """
    ---
    tags:
      - Skywall Core
    summary: Add group
    description: Creates a new group
    produces:
      - application/json
    parameters:
      - name: body
        in: body
        description: Group properties to be saved
        required: true
        schema:
          type: object
          title: PostGroupBody
          required:
            - name
          properties:
            name:
              type: string
            description:
              type: string
    responses:
      200:
        description: Group added
        schema:
          type: object
          title: PostGroupResponse
          required:
            - ok
            - groupId
          properties:
            ok:
              type: boolean
            groupId:
              type: integer
    """
    body = await parse_json_body(request)
    try:
        with create_session() as session:

            name = assert_request_param_is_string('name', body)
            if not re.match(r'^\w+$', name):
                raise HTTPBadRequest(reason='Name may contain only numbers and letters')
            if name.lower() == 'default':
                raise HTTPBadRequest(reason='Name "default" is reserverd')

            if 'description' in body:
                description = assert_request_param_is_string('description', body)
            else:
                description = None

            group = Group(
                    name=name,
                    description=description,
                    )
            before_group_create.emit(session=session, group=group)
            session.add(group)
            session.flush()
            after_group_create.emit(session=session, group=group)
            return json_response({'ok': True, 'groupId': group.id})

    except IntegrityError as e:
        if 'group_name_key' in str(e):
            raise HTTPBadRequest(reason='Name already used by another group')
        raise e
