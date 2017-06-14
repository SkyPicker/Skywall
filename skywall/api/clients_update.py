import asyncio
from aiohttp.web import json_response, HTTPServiceUnavailable
from skywall.core.api import register_api, parse_json_body, parse_obj_path_param, assert_request_param_is_string
from skywall.core.database import create_session
from skywall.core.server import get_server
from skywall.models.client import Client
from skywall.actions.labels import SetLabelClientAction


async def _send_label_to_client(client_id, label):
    connection = get_server().get_connection(client_id)
    if not connection:
        raise HTTPServiceUnavailable(reason='Client {} is not connected right now'.format(client_id))
    try:
        await connection.check_send_action(SetLabelClientAction(label=label))
    except asyncio.TimeoutError:
        raise HTTPServiceUnavailable(reason='Client {} is not responding right now'.format(client_id))


@register_api('PUT', '/clients/{clientId}')
async def update_client(request):
    """
    ---
    tags:
      - Clients
    summary: Update client
    description: Updates an existing client
    produces:
      - text/pain
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
            await _send_label_to_client(client.id, label)
            client.label = label
        return json_response({'ok': True})
