import re
from aiohttp.web import json_response, HTTPBadRequest
from sqlalchemy.exc import IntegrityError
from skywall.core.signals import Signal
from skywall.core.api import register_api, parse_json_body, parse_obj_path_param, assert_request_param_is_string
from skywall.core.database import create_session
from skywall.models.groups import Group, before_group_update, after_group_update


before_update_group = Signal('before_update_group')
after_update_group = Signal('before_update_group')


@register_api('PUT', '/groups/{groupId}', before_update_group, after_update_group)
async def update_group(request):
    """
    ---
    tags:
      - Skywall Core
    summary: Update group
    description: Updates an existing group
    produces:
      - application/json
    parameters:
      - name: groupId
        in: path
        description: ID of group to update
        required: true
        type: integer
      - name: body
        in: body
        description: Group properties to be updated
        required: true
        schema:
          type: object
          title: PutGroupBody
          required: []
          properties:
            name:
              type: string
            description:
              type: string
    responses:
      200:
        description: Group updated
        schema:
          type: object
          title: PutGroupResponse
          required:
            - ok
          properties:
            ok:
              type: boolean
      404:
        description: Group not found
    """
    body = await parse_json_body(request)
    try:
        with create_session() as session:
            group = parse_obj_path_param(request, 'groupId', session, Group)

            if 'name' in body:
                name = assert_request_param_is_string('name', body)
                if not re.match(r'^\w+$', name):
                    raise HTTPBadRequest(reason='Name may contain only numbers and letters')
                if name.lower() == 'default':
                    raise HTTPBadRequest(reason='Name "default" is reserverd')
                group.name = name

            if 'description' in body:
                description = assert_request_param_is_string('description', body)
                group.description = description

            before_group_update.emit(session=session, group=group)
            session.flush()
            after_group_update.emit(session=session, group=group)
            return json_response({'ok': True})

    except IntegrityError as e:
        if 'group_name_key' in str(e):
            raise HTTPBadRequest(reason='Name already used by another group')
        raise e
