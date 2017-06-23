from aiohttp.web import json_response
from skywall.core.signals import Signal
from skywall.core.api import register_api, parse_obj_path_param
from skywall.core.database import create_session
from skywall.models.groups import Group, before_group_delete, after_group_delete


before_delete_group = Signal('before_delete_group')
after_delete_group = Signal('before_delete_group')


@register_api('DELETE', '/groups/{groupId}', before_delete_group, after_delete_group)
async def delete_group(request):
    """
    ---
    tags:
      - Skywall Core
    summary: Delete group
    description: Deletes an existing group
    produces:
      - application/json
    parameters:
      - name: groupId
        in: path
        description: ID of group to delete
        required: true
        type: integer
    responses:
      200:
        description: Group deleted
        schema:
          type: object
          title: DeleteGroupResponse
          required:
            - ok
          properties:
            ok:
              type: boolean
      404:
        description: Group not found
    """
    with create_session() as session:
        group = parse_obj_path_param(request, 'groupId', session, Group)
        before_group_delete.emit(session=session, group=group)
        session.delete(group)
        session.flush()
        after_group_delete.emit(session=session, group=group)
        return json_response({'ok': True})
