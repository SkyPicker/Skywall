import React from 'react'
import {filter, isEmpty} from 'lodash'
import {formatPattern} from 'react-router'
import {Table} from 'react-bootstrap'
import {Choose, When, Otherwise, For, With} from 'jsx-control-statements'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {EMDASH, CHECK_MARK, CROSS_MARK} from '../constants/symbols'
import * as routes from '../constants/routes'
import {applyOverlays} from '../utils/overlays'
import TdLink from './visual/TdLink'


export class GroupDetailClientTableComponent extends React.Component {

  static propTypes = {
    // Props from parent element
    group: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),

    // Props from store
    clients: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string,
      groupId: PropTypes.number,
      connected: PropTypes.bool,
    })),
  }

  render() {
    const {group} = this.props
    const clients = filter(this.props.clients, {groupId: group ? group.id : null})
    return (
      <div>
        <h3>Clients in group</h3>
        <Choose>
          <When condition={isEmpty(clients)}>
            No clients
          </When>
          <Otherwise>
            <Table striped bordered condensed hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Label</th>
                  <th>Connected</th>
                </tr>
              </thead>
              <tbody>
                <For each="client" of={clients}>
                  <With link={formatPattern(routes.CLIENT_DETAIL, {clientId: client.id})}>
                    <tr key={client.id} data-clientId={client.id}>
                      <TdLink to={link}>
                        {client.id}
                      </TdLink>
                      <TdLink to={link}>
                        {client.label || EMDASH}
                      </TdLink>
                      <TdLink to={link}>
                        {client.connected ? CHECK_MARK : CROSS_MARK}
                      </TdLink>
                    </tr>
                  </With>
                </For>
              </tbody>
            </Table>
          </Otherwise>
        </Choose>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  clients: state.clients.data.clients,
})

const mapDispatchToProps = {
  // Empty
}

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  applyOverlays,
)(GroupDetailClientTableComponent)
