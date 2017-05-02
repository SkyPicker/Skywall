import React from 'react'
import {find, toInteger} from 'lodash'
import {Alert, Button} from 'react-bootstrap'
import {IndexLinkContainer} from 'react-router-bootstrap'
import {If} from 'jsx-control-statements'
import * as routes from '../constants/routes'
import {getClients, renewClients} from '../actions/clients'
import confirmDirty from '../hocs/confirmDirty'
import ClientForm from '../forms/ClientForm'
import {connect} from '../utils'


class Clients extends React.Component {

  static propTypes = {
    // Props from router
    params: React.PropTypes.shape({
      clientId: React.PropTypes.string.isRequired,
    }),

    // Props from store
    clients: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      connected: React.PropTypes.bool.isRequired,
    })),
    connections: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      clientId: React.PropTypes.number.isRequired,
    })),
    reports: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      clientId: React.PropTypes.number.isRequired,
    })),

    // Actions
    getClients: React.PropTypes.func.isRequired,
    renewClients: React.PropTypes.func.isRequired,

    // Props from confirmDirty
    registerDirty: React.PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.renewClients()
  }

  render() {
    if (!this.props.clients) return null
    const {clients, connections, reports, params, registerDirty, getClients} = this.props
    const clientId = toInteger(params.clientId)
    const client = find(clients, {id: clientId})
    const connection = find(connections, {clientId})
    const report = find(reports, {clientId})
    return (
      <div>
        <div className="pull-right">
          <IndexLinkContainer to={routes.CLIENTS}>
            <Button>Show All Clients</Button>
          </IndexLinkContainer>
          {' '}
          <Button onClick={getClients}>Refresh</Button>
        </div>
        <h2>Client #{clientId}</h2>
        <If condition={!client.connected}>
          <Alert bsStyle="warning">
            Client #{clientId} is not connected right now.
          </Alert>
        </If>
        <ClientForm
            inactive
            client={client}
            connection={connection}
            report={report}
            registerDirty={registerDirty}
        />
      </div>
    )
  }
}

export default confirmDirty(connect(Clients, {getClients, renewClients}, (state) => ({
  clients: state.clients.clients,
  connections: state.clients.connections,
  reports: state.clients.reports,
})))
