from aiohttp.web import json_response
from skywall.core.api import register_api, parse_obj_path_param
from skywall.core.database import create_session
from skywall.models.groups import Group


@register_api('DELETE', '/groups/{groupId}')
async def delete_group(request):
    """
    ---
    tags:
      - Groups
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
        session.delete(group)
        return json_response({'ok': True})
