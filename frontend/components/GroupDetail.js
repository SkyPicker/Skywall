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
import signalRender from '../hocs/signalRender'
import {RenderSignal} from '../utils/signals'
import Loading from './visual/Loading'
import NotFound from './NotFound'
import GroupDetailForm from './GroupDetailForm'
import GroupDetailClientTable from './GroupDetailClientTable'


class GroupDetail extends React.Component {

  static propTypes = {
    // Props from router
    params: PropTypes.shape({
      groupId: PropTypes.string.isRequired,
    }),

    // Props from store
    groups: PropTypes.arrayOf(PropTypes.shape({
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
    const {groups, params, registerDirty, getClients} = this.props
    if (!groups) return <Loading />
    const groupId = toInteger(params.groupId)
    const group = find(groups, {id: groupId})
    if (!group) return <NotFound />
    return (
      <div>
        <div className="pull-right">
          <IndexLinkContainer to={routes.GROUP_LIST}>
            <Button>Show All Groups</Button>
          </IndexLinkContainer>
          {NBSP}
          <Button onClick={getClients}>Refresh</Button>
        </div>
        <GroupDetailForm inactive group={group} registerDirty={registerDirty} />
        <GroupDetailClientTable group={group} />
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

export const groupDetailRenderSignal = new RenderSignal('groupDetailRenderSignal')

export default compose(
  confirmDirty,
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  signalRender(groupDetailRenderSignal),
)(GroupDetail)
