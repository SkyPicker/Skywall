from aiohttp.web import json_response
from sqlalchemy import desc
from skywall.core.api import register_api
from skywall.core.signals import Signal
from skywall.core.database import create_session
from skywall.core.reports import reports_registry
from skywall.core.server import get_server
from skywall.models.clients import Client
from skywall.models.groups import Group
from skywall.models.connections import Connection
from skywall.models.reports import Report, ReportValue


before_get_clients = Signal('before_get_clients')
after_get_clients = Signal('before_get_clients')


def _client_response(client):
    return {
            'id': client.id,
            'created': client.created.timestamp(),
            'label': client.label,
            'groupId': client.group_id,
            'connected': get_server().get_connection(client.id) is not None,
            }

def _clients_response(clients):
    return [_client_response(client) for client in clients]

def _group_response(group):
    return {
            'id': group.id,
            'name': group.name,
            'description': group.description,
            }

def _group_responses(groups):
    return [_group_response(group) for group in groups]

def _report_response(report):
    return {
            'id': report.id,
            'created': report.created.timestamp(),
            'clientId': report.client_id,
            }

def _reports_response(reports):
    return [_report_response(report) for report in reports]

def _connection_response(connection):
    return {
            'id': connection.id,
            'created': connection.created.timestamp(),
            'clientId': connection.client_id,
            'lastActivity': connection.last_activity.timestamp(),
            'closed': connection.closed and connection.closed.timestamp(),
            }

def _connections_response(connections):
    return [_connection_response(connection) for connection in connections]

def _value_response(value):
    return {
            'id': value.id,
            'created': value.created.timestamp(),
            'reportId': value.report_id,
            'name': value.name,
            'value': value.value,
            }

def _values_response(values):
    return [_value_response(value) for value in values]

def _field_response(field):
    return {
            'name': field.name,
            'label': field.label,
            }

def _fields_response(fields):
    return [_field_response(field) for field in fields]


@register_api('GET', '/clients', before_get_clients, after_get_clients)
async def get_clients(request):
    """
    ---
    tags:
      - Skywall Core
    summary: List of clients
    description: Returns list of clients with their most recent connections and reports
    produces:
      - application/json
    responses:
      200:
        description: List of clients with their most recent connections and reports
        schema:
          type: object
          title: GetClientsResponse
          required:
            - clients
            - connections
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
                  - connected
                properties:
                  id:
                    type: integer
                  created:
                    type: number
                    format: float
                  label:
                    type: string
                  groupId:
                    type: integer
                  connected:
                    type: boolean
            groups:
              type: array
              items:
                type: object
                title: Group
                required:
                  - id
                  - name
                  - description
                properties:
                  id:
                    type: integer
                  name:
                    type: string
                  description:
                    type: string
            connections:
              type: array
              items:
                type: object
                title: Connection
                required:
                  - id
                  - created
                  - clientId
                  - lastActivity
                  - closed
                properties:
                  id:
                    type: integer
                  created:
                    type: number
                    format: float
                  clientId:
                    type: integer
                  lastActivity:
                    type: number
                    format: float
                  closed:
                    type: number
                    format: float
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
    with create_session() as session:
        clients = session.query(Client).order_by(Client.id).all()
        groups = session.query(Group).order_by(Group.id).all()
        connections = list(filter(None, (
                session.query(Connection)
                    .filter(Connection.client_id == client.id)
                    .order_by(desc(Connection.created)).first()
                        for client in clients
                )))
        reports = list(filter(None, (
                session.query(Report)
                    .filter(Report.client_id == client.id)
                    .order_by(desc(Report.created)).first()
                        for client in clients
                )))
        values = (session.query(ReportValue)
                .filter(ReportValue.report_id.in_(report.id for report in reports)).all())
        return json_response({
                'clients': _clients_response(clients),
                'groups': _group_responses(groups),
                'connections': _connections_response(connections),
                'reports': _reports_response(reports),
                'values': _values_response(values),
                'fields': _fields_response(reports_registry.values()),
                })
