from aiohttp.web import json_response
from sqlalchemy import desc
from skywall.core.api import register_api, parse_json_body, parse_obj_path_param, assert_request_param_is_string
from skywall.core.database import Session
from skywall.core.reports import reports_registry
from skywall.models.client import Client
from skywall.models.reports import Report, ReportValue


def client_response(client):
    return {
            'id': client.id,
            'created': client.created.timestamp(),
            'label': client.label,
            }

def clients_response(clients):
    return [client_response(client) for client in clients]

def report_response(report):
    return {
            'id': report.id,
            'created': report.created.timestamp(),
            'clientId': report.client_id,
            }

def reports_response(reports):
    return [report_response(report) for report in reports]

def value_response(value):
    return {
            'id': value.id,
            'created': value.created.timestamp(),
            'reportId': value.report_id,
            'name': value.name,
            'value': value.value,
            }

def values_response(values):
    return [value_response(value) for value in values]

def field_response(field):
    return {
            'name': field.name,
            'label': field.label,
            }

def fields_response(fields):
    return [field_response(field) for field in fields]


@register_api('GET', '/clients')
async def get_clients(request):
    """
    ---
    tags:
      - Clients
    summary: List of clients
    description: Returns list of clients with their most recent reports
    produces:
      - application/json
    responses:
      200:
        description: List of clients with their most recent reports
        schema:
          type: object
          title: GetClientsResponse
          required:
            - clients
            - reports
            - values
            - fields
          properties:
            clients:
              type: array
              items:
                type: object
                title: Client
                required:
                  - id
                  - created
                  - label
                properties:
                  id:
                    type: integer
                  created:
                    type: number
                    format: float
                  label:
                    type: string
            reports:
              type: array
              items:
                type: object
                title: Report
                required:
                  - id
                  - created
                  - clientId
                properties:
                  id:
                    type: integer
                  created:
                    type: number
                    format: float
                  clientId:
                    type: integer
            values:
              type: array
              items:
                type: object
                title: Value
                required:
                  - id
                  - created
                  - reportId
                  - name
                  - value
                properties:
                  id:
                    type: integer
                  created:
                    type: number
                    format: float
                  reportId:
                    type: integer
                  name:
                    type: string
                  value:
                    type: any
            fields:
              type: array
              items:
                type: object
                title: Field
                required:
                  - name
                  - label
                properties:
                  name:
                    type: string
                  label:
                    type: string
    """
    with Session() as session:
        clients = session.query(Client).order_by(Client.id).all()
        reports = list(filter(None, (
                session.query(Report).filter(Report.client_id == client.id).order_by(desc(Report.created)).first()
                    for client in clients
                )))
        values = (session.query(ReportValue)
                .filter(ReportValue.report_id.in_(report.id for report in reports)).all())
        return json_response({
                'clients': clients_response(clients),
                'reports': reports_response(reports),
                'values': values_response(values),
                'fields': fields_response(reports_registry.values()),
                })


@register_api('PUT', '/clients/{clientId}')
async def put_clients(request):
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
          required:
            - label
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
    with Session() as session:
        body = await parse_json_body(request)
        client = parse_obj_path_param(request, 'clientId', session, Client)
        if 'label' in body:
            assert_request_param_is_string('label', body['label'])
            client.label = body['label']
        return json_response({'ok': True})
