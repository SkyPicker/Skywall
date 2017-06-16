import React from 'react'
import {countBy} from 'lodash'
import {formatPattern} from 'react-router'
import {IndexLinkContainer} from 'react-router-bootstrap'
import {Table, Button} from 'react-bootstrap'
import {For, With} from 'jsx-control-statements'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {EMDASH} from '../constants/symbols'
import * as routes from '../constants/routes'
import signalRender from '../hocs/signalRender'
import {RenderSignal} from '../utils/signals'
import {defaultGroupLabel, defaultGroupDescription} from '../utils/humanize'
import TdLink from './visual/TdLink'


class GroupListTable extends React.Component {

  static propTypes = {
    // Props from store
    groups: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      description: PropTypes.string,
    })),
    clients: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      groupId: PropTypes.number,
    })),
  }

  render() {
    const {groups, clients} = this.props
    const numberOfClientsByGroupId = countBy(clients, 'groupId')
    return (
      <div>
        <div className="pull-right">
          <IndexLinkContainer to={routes.GROUP_ADD}>
            <Button>Add Group</Button>
          </IndexLinkContainer>
        </div>
        <h2>Groups</h2>
        <Table striped bordered condensed hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Clients</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TdLink to={routes.GROUP_DEFAULT}>
                {EMDASH}
              </TdLink>
              <TdLink to={routes.GROUP_DEFAULT}>
                {defaultGroupLabel || EMDASH}
              </TdLink>
              <TdLink to={routes.GROUP_DEFAULT}>
                {defaultGroupDescription || EMDASH}
              </TdLink>
              <TdLink to={routes.GROUP_DEFAULT}>
                {numberOfClientsByGroupId.null || 0}
              </TdLink>
            </tr>
            <For each="group" of={groups}>
              <With link={formatPattern(routes.GROUP_DETAIL, {groupId: group.id})}>
                <tr key={group.id} data-groupId={group.id}>
                  <TdLink to={link}>
                    {group.id}
                  </TdLink>
                  <TdLink to={link}>
                    {group.name || EMDASH}
                  </TdLink>
                  <TdLink to={link}>
                    {group.description || EMDASH}
                  </TdLink>
                  <TdLink to={link}>
                    {numberOfClientsByGroupId[group.id] || 0}
                  </TdLink>
                </tr>
              </With>
            </For>
          </tbody>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  groups: state.clients.data.groups,
  clients: state.clients.data.clients,
})

const mapDispatchToProps = {
  // Empty
}

export const groupListTableRenderSignal = new RenderSignal('groupListTableRenderSignal')

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  signalRender(groupListTableRenderSignal),
)(GroupListTable)
