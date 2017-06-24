import React from 'react'
import {Button} from 'react-bootstrap'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {NBSP} from '../constants/symbols'
import {getClients, renewClients} from '../actions/clients'
import {applyOverlays} from '../utils/overlays'
import Loading from './visual/Loading'
import GroupListTable from './GroupListTable'


export class GroupListComponent extends React.Component {

  static propTypes = {
    // Props from store
    groups: PropTypes.arrayOf(PropTypes.shape({
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
    const {groups, getClients} = this.props
    if (!groups) return <Loading />
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
  groups: state.clients.data.groups,
})

const mapDispatchToProps = {
  getClients,
  renewClients,
}

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  applyOverlays,
)(GroupListComponent)
