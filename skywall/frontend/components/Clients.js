import React from 'react'
import {get, isNil, mapValues, identity, keyBy, groupBy, sortBy, isEmpty} from 'lodash'
import {Table} from 'react-bootstrap'
import {Choose, When, Otherwise, For} from 'jsx-control-statements'
import moment from 'moment'
import reportFormaters from '../../reports/formaters'
import {getClients} from '../actions/clients'
import {connect} from '../utils'
import Emdash from './common/Emdash'
import Moment from './common/Moment'


class Clients extends React.Component {

  static propTypes = {
    clients: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      created: React.PropTypes.number.isRequired,
      label: React.PropTypes.string.isRequired,
    })),
    reports: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      created: React.PropTypes.number.isRequired,
      clientId: React.PropTypes.number.isRequired,
    })),
    values: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      created: React.PropTypes.number.isRequired,
      reportId: React.PropTypes.number.isRequired,
      name: React.PropTypes.string.isRequired,
      value: React.PropTypes.any.isRequired,
    })),
    fields: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      label: React.PropTypes.string.isRequired,
    })),
  }

  componentDidMount() {
    this.props.getClients()
  }

  renderValue(field, client, valuesMap, reportsMap) {
    const report = reportsMap[client.id]
    const value = report && get(valuesMap, [report.id, field.name, 'value'])
    const formater = reportFormaters[field.name] || identity
    if (isNil(value)) return <Emdash />
    try {
      return formater(value)
    } catch (e) {
      return <Emdash />
    }
  }

  render() {
    if (!this.props.clients) return null
    const {clients, reports, values} = this.props
    const fields = sortBy(this.props.fields, 'name')
    const reportsMap = keyBy(reports, 'clientId')
    const valuesMap = mapValues(groupBy(values, 'reportId'), (values) => keyBy(values, 'name'))
    return (
      <div>
        <h2>Connected clients</h2>
        <Choose>
          <When condition={isEmpty(clients)}>
            <div>
              Connect some clients to your Skywall server.
            </div>
          </When>
          <Otherwise>
            <Table striped bordered condensed hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Label</th>
                  <th>First connection</th>
                  <th>Last report</th>
                  <For each="field" of={fields}>
                    <th key={field.name}>{field.label}</th>
                  </For>
                </tr>
              </thead>
              <tbody>
                <For each="client" of={clients}>
                  <tr key={client.id}>
                    <td>{client.id}</td>
                    <td>{client.label || <Emdash />}</td>
                    <td><Moment at={moment.unix(client.created)} /></td>
                    <Choose>
                      <When condition={reportsMap[client.id]}>
                        <td><Moment at={moment.unix(reportsMap[client.id].created)} /></td>
                      </When>
                      <Otherwise>
                        <td>never</td>
                      </Otherwise>
                    </Choose>
                    <For each="field" of={fields}>
                      <td key={field.name}>{this.renderValue(field, client, valuesMap, reportsMap)}</td>
                    </For>
                  </tr>
                </For>
              </tbody>
            </Table>
          </Otherwise>
        </Choose>
      </div>
    )
  }
}

export default connect(Clients, {getClients}, (state) => ({
  clients: state.clients.clients,
  reports: state.clients.reports,
  values: state.clients.values,
  fields: state.clients.fields,
}))
