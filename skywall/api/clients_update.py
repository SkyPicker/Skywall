import asyncio
from aiohttp.web import json_response, HTTPServiceUnavailable
from skywall.core.signals import Signal
from skywall.core.api import (
        register_api, parse_json_body, parse_obj_path_param, assert_request_param_is_string,
        assert_request_param_is_entity,
        )
from skywall.core.database import create_session
from skywall.core.server import get_server
from skywall.models.groups import Group
from skywall.models.clients import Client, before_client_update, after_client_update
from skywall.actions.labels import SetLabelClientAction


before_update_client = Signal('before_update_client')
after_update_client = Signal('before_update_client')


async def _send_label_to_client(client_id, label):
    connection = get_server().get_connection(client_id)
    if not connection:
        reason = 'Changing label failed. Client {} is not connected right now.'.format(client_id)
        raise HTTPServiceUnavailable(reason=reason)
    try:
        await connection.check_send_action(SetLabelClientAction(label=label))
    except asyncio.TimeoutError:
        reason = 'Changing label failed. Client {} is not responding right now.'.format(client_id)
        raise HTTPServiceUnavailable(reason=reason)


@register_api('PUT', '/clients/{clientId}', before_update_client, after_update_client)
async def update_client(request):
    """
    ---
    tags:
      - Skywall Core
    summary: Update client
    description: Updates an existing client
    produces:
      - application/json
    parameters:
      - name: clientId
        in: path
        description: ID of client to update
        required: true
        type: integer
      - name: body
        in: body
        description: Client properties to be updated
        required: true
        schema:
          type: object
          title: PutClientBody
          required: []
          properties:
            label:
              type: string
            groupId:
              type: integer
    responses:
      200:
        description: Client updated
        schema:
          type: object
          title: PutClientResponse
          required:
            - ok
          properties:
            ok:
              type: boolean
      404:
        description: Client not found
    """
    body = await parse_json_body(request)
    with create_session() as session:
        client = parse_obj_path_param(request, 'clientId', session, Client)

        if 'label' in body:
            label = assert_request_param_is_string('label', body)
            if label != client.label:
                await _send_label_to_client(client.id, label)
                client.label = label

        if 'groupId' in body:
            if body['groupId'] is None:
                group = None
            else:
                group = assert_request_param_is_entity('groupId', body, session, Group)
            client.group = group

        before_client_update.emit(session=session, client=client)
        session.flush()
        after_client_update.emit(session=session, client=client)
        return json_response({'ok': True})
