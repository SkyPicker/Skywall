import React from 'react'
import {Button} from 'react-bootstrap'
import {IndexLinkContainer} from 'react-router-bootstrap'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {NBSP} from '../constants/symbols'
import * as routes from '../constants/routes'
import {getClients, renewClients} from '../actions/clients'
import {applyOverlays} from '../utils/overlays'
import Loading from './visual/Loading'
import GroupDefaultForm from './GroupDefaultForm'
import GroupDetailClientTable from './GroupDetailClientTable'


export class GroupDefaultComponent extends React.Component {

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
          <IndexLinkContainer to={routes.GROUP_LIST}>
            <Button>Show All Groups</Button>
          </IndexLinkContainer>
          {NBSP}
          <Button onClick={getClients}>Refresh</Button>
        </div>
        <GroupDefaultForm />
        <GroupDetailClientTable />
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
)(GroupDefaultComponent)
