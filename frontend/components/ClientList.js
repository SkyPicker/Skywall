import React from 'react'
import {Button} from 'react-bootstrap'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {getClients, renewClients} from '../actions/clients'
import {applyOverlays} from '../utils/overlays'
import Loading from './visual/Loading'
import ClientListTable from './ClientListTable'


export class ClientListComponent extends React.Component {

  static propTypes = {
    // Props from store
    clients: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })),

    // Actions
    getClients: PropTypes.func.isRequired,
    renewClients: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.renewClients()
  }

  render() {
    const {clients, getClients} = this.props
    if (!clients) return <Loading />
    return (
      <div>
        <div className="pull-right">
          <Button onClick={getClients}>Refresh</Button>
        </div>
        <ClientListTable />
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
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  applyOverlays,
)(ClientListComponent)
