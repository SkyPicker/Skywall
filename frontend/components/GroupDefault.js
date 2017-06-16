import React from 'react'
import {Button} from 'react-bootstrap'
import {IndexLinkContainer} from 'react-router-bootstrap'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {NBSP} from '../constants/symbols'
import * as routes from '../constants/routes'
import {getClients, renewClients} from '../actions/clients'
import signalRender from '../hocs/signalRender'
import {RenderSignal} from '../utils/signals'
import GroupDefaultForm from './GroupDefaultForm'
import GroupDetailClientTable from './GroupDetailClientTable'


class GroupDefault extends React.Component {

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
  // Empty
})

const mapDispatchToProps = {
  getClients,
  renewClients,
}

export const groupDefaultRenderSignal = new RenderSignal('groupDefaultRenderSignal')

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  signalRender(groupDefaultRenderSignal),
)(GroupDefault)
