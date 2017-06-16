import React from 'react'
import {get, isNil, mapValues, identity, keyBy, groupBy, sortBy, isEmpty} from 'lodash'
import {formatPattern} from 'react-router'
import {Table} from 'react-bootstrap'
import {Choose, When, Otherwise, For, With} from 'jsx-control-statements'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {EMDASH, CHECK_MARK, CROSS_MARK} from '../constants/symbols'
import * as routes from '../constants/routes'
import reportFormaters from '../reports/formaters'
import signalRender from '../hocs/signalRender'
import {RenderSignal} from '../utils/signals'
import {groupLabel} from '../utils/humanize'
import Moment from './visual/Moment'
import TdLink from './visual/TdLink'


class ClientListTable extends React.Component {

  static propTypes = {
    // Props from store
    groups: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
    })),
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
    const {groups, clients, reports, values} = this.props
    const fields = sortBy(this.props.fields, 'name')
    const groupsById = keyBy(groups, 'id')
    const reportsMap = keyBy(reports, 'clientId')
    const valuesMap = mapValues(groupBy(values, 'reportId'), (values) => keyBy(values, 'name'))
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
                  <th>Group</th>
                  <th>Last report</th>
                  <For each="field" of={fields}>
                    <th key={field.name}>{field.label}</th>
                  </For>
                  <th>Connected</th>
                </tr>
              </thead>
              <tbody>
                <For each="client" of={clients}>
                  <With link={formatPattern(routes.CLIENT_DETAIL, {clientId: client.id})}>
                    <tr key={client.id} data-clientId={client.id}>
                      <TdLink to={link}>
                        {client.id}
                      </TdLink>
                      <TdLink to={link}>
                        {client.label || EMDASH}
                      </TdLink>
                      <TdLink to={link}>
                        {groupLabel(groupsById[client.groupId]) || EMDASH}
                      </TdLink>
                      <TdLink to={link}>
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
                        <TdLink key={field.name} to={link}>
                          {this.renderValue(field, client, valuesMap, reportsMap)}
                        </TdLink>
                      </For>
                      <TdLink to={link}>
                        {client.connected ? CHECK_MARK : CROSS_MARK}
                      </TdLink>
                    </tr>
                  </With>
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
  groups: state.clients.data.groups,
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
