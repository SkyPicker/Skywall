import React from 'react'
import {Button} from 'react-bootstrap'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {getClients, renewClients} from '../actions/clients'
import signalRender from '../hocs/signalRender'
import {RenderSignal} from '../utils/signals'
import ClientListTable from './ClientListTable'


class ClientList extends React.Component {

  static propTypes = {
    // Actions
    getClients: PropTypes.func.isRequired,
    renewClients: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.renewClients()
  }

  render() {
    const {getClients} = this.props
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
  // Empty
})

const mapDispatchToProps = {
  getClients,
  renewClients,
}

export const clientListRenderSignal = new RenderSignal('clientListRenderSignal')

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  signalRender(clientListRenderSignal),
)(ClientList)
