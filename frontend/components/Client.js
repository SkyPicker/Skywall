import React from 'react'
import {find, toInteger} from 'lodash'
import {Alert, Button} from 'react-bootstrap'
import {IndexLinkContainer} from 'react-router-bootstrap'
import {If} from 'jsx-control-statements'
import {compose} from 'redux'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import * as routes from '../constants/routes'
import {getClients, renewClients} from '../actions/clients'
import confirmDirty from '../hocs/confirmDirty'
import ClientForm from '../forms/ClientForm'
import {clientRenderSignal} from '../signals'
import signalRender from '../hocs/signalRender'


class Client extends React.Component {

  static propTypes = {
    // Props from router
    params: PropTypes.shape({
      clientId: PropTypes.string.isRequired,
    }),

    // Props from store
    clients: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      connected: PropTypes.bool,
    })),
    connections: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      clientId: PropTypes.number,
    })),
    reports: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      clientId: PropTypes.number,
    })),

    // Actions
    getClients: PropTypes.func.isRequired,
    renewClients: PropTypes.func.isRequired,

    // Props from confirmDirty
    registerDirty: PropTypes.func.isRequired,
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

const mapStateToProps = (state) => ({
  clients: state.clients.clients,
  connections: state.clients.connections,
  reports: state.clients.reports,
})

const mapDispatchToProps = (dispatch) => ({
  getClients: () => dispatch(getClients()),
  renewClients: () => dispatch(renewClients()),
})

export default compose(
  confirmDirty,
  connect(mapStateToProps, mapDispatchToProps),
  signalRender(clientRenderSignal),
)(Client)
