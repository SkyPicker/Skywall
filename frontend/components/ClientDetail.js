import React from 'react'
import {find, toInteger} from 'lodash'
import {Button} from 'react-bootstrap'
import {IndexLinkContainer} from 'react-router-bootstrap'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {NBSP} from '../constants/symbols'
import * as routes from '../constants/routes'
import {getClients, renewClients} from '../actions/clients'
import confirmDirty from '../hocs/confirmDirty'
import {applyOverlays} from '../utils/overlays'
import Loading from './visual/Loading'
import NotFound from './NotFound'
import ClientDetailForm from './ClientDetailForm'


export class ClientDetailComponent extends React.Component {

  static propTypes = {
    // Props from router
    params: PropTypes.shape({
      clientId: PropTypes.string.isRequired,
    }),

    // Props from store
    clients: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
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
    const {clients, params, registerDirty, getClients} = this.props
    if (!clients) return <Loading />
    const clientId = toInteger(params.clientId)
    const client = find(clients, {id: clientId})
    if (!client) return <NotFound />
    return (
      <div>
        <div className="pull-right">
          <IndexLinkContainer to={routes.CLIENT_LIST}>
            <Button>Show All Clients</Button>
          </IndexLinkContainer>
          {NBSP}
          <Button onClick={getClients}>Refresh</Button>
        </div>
        <ClientDetailForm inactive client={client} registerDirty={registerDirty} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  clients: state.clients.data.clients,
})

const mapDispatchToProps = {
  getClients,
  renewClients,
}

export default compose(
  confirmDirty,
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  applyOverlays,
)(ClientDetailComponent)
