import React from 'react'
import {get, isNil, mapValues, identity, keyBy, groupBy, sortBy, isEmpty} from 'lodash'
import {formatPattern} from 'react-router'
import {Table} from 'react-bootstrap'
import {Choose, When, Otherwise, For} from 'jsx-control-statements'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {EMDASH, CHECK_MARK, CROSS_MARK} from '../constants/symbols'
import * as routes from '../constants/routes'
import reportFormaters from '../reports/formaters'
import signalRender from '../hocs/signalRender'
import {RenderSignal} from '../utils/signals'
import Moment from './visual/Moment'
import TdLink from './visual/TdLink'


class ClientListTable extends React.Component {

  static propTypes = {
    // Props from store
    clients: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string,
      connected: PropTypes.bool,
    })),
    reports: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      created: PropTypes.number,
      clientId: PropTypes.number,
    })),
    values: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      reportId: PropTypes.number,
      name: PropTypes.string,
      value: PropTypes.any,
    })),
    fields: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })),
  }

  renderValue(field, client, valuesMap, reportsMap) {
    const report = reportsMap[client.id]
    const value = report && get(valuesMap, [report.id, field.name, 'value'])
    const formater = reportFormaters[field.name] || identity
    if (isNil(value)) return EMDASH
    try {
      return formater(value)
    } catch (e) {
      return EMDASH
    }
  }

  render() {
    if (!this.props.clients) return null
    const {clients, reports, values} = this.props
    const fields = sortBy(this.props.fields, 'name')
    const clientsById = keyBy(clients, 'id')
    const reportsMap = keyBy(reports, 'clientId')
    const valuesMap = mapValues(groupBy(values, 'reportId'), (values) => keyBy(values, 'name'))
    const links = mapValues(clientsById, (client) => formatPattern(routes.CLIENT_DETAIL, {clientId: client.id}))
    return (
      <div>
        <h2>Clients</h2>
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
                  <th>Last report</th>
                  <For each="field" of={fields}>
                    <th key={field.name}>{field.label}</th>
                  </For>
                  <th>Connected</th>
                </tr>
              </thead>
              <tbody>
                <For each="client" of={clients}>
                  <tr key={client.id} data-clientId={client.id}>
                    <TdLink to={links[client.id]}>
                      {client.id}
                    </TdLink>
                    <TdLink to={links[client.id]}>
                      {client.label || EMDASH}
                    </TdLink>
                    <TdLink to={links[client.id]}>
                      <Choose>
                        <When condition={reportsMap[client.id]}>
                          <Moment at={reportsMap[client.id].created} />
                        </When>
                        <Otherwise>
                          never
                        </Otherwise>
                      </Choose>
                    </TdLink>
                    <For each="field" of={fields}>
                      <TdLink key={field.name} to={links[client.id]}>
                        {this.renderValue(field, client, valuesMap, reportsMap)}
                      </TdLink>
                    </For>
                    <TdLink to={links[client.id]}>
                      {client.connected ? CHECK_MARK : CROSS_MARK}
                    </TdLink>
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

const mapStateToProps = (state) => ({
  clients: state.clients.data.clients,
  reports: state.clients.data.reports,
  values: state.clients.data.values,
  fields: state.clients.data.fields,
})

const mapDispatchToProps = {
  // Empty
}

export const clientListTableRenderSignal = new RenderSignal('clientListTableRenderSignal')

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  signalRender(clientListTableRenderSignal),
)(ClientListTable)
