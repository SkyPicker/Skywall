import React from 'react'
import {Button} from 'react-bootstrap'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {NBSP} from '../constants/symbols'
import {getClients, renewClients} from '../actions/clients'
import signalRender from '../hocs/signalRender'
import {RenderSignal} from '../utils/signals'
import GroupListTable from './GroupListTable'


class GroupList extends React.Component {

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
          {NBSP}
          <Button onClick={getClients}>Refresh</Button>
        </div>
        <GroupListTable />
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

export const groupListRenderSignal = new RenderSignal('groupListRenderSignal')

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  signalRender(groupListRenderSignal),
)(GroupList)
