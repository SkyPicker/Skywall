import React from 'react'
import {Nav, NavItem, Col} from 'react-bootstrap'
import {LinkContainer, IndexLinkContainer} from 'react-router-bootstrap'
import {compose} from 'redux'
import * as routes from '../constants/routes'
import signalRender from '../hocs/signalRender'
import {RenderSignal} from '../utils/signals'


class Menu extends React.Component {

  static propTypes = {
  }

  render() {
    return (
      <Col sm={3} xs={12}>
        <Nav bsStyle="pills" stacked>
          <IndexLinkContainer to="/">
            <NavItem>Dashboard</NavItem>
          </IndexLinkContainer>
          <LinkContainer to={routes.CLIENT_LIST}>
            <NavItem>Clients</NavItem>
          </LinkContainer>
        </Nav>
      </Col>
    )
  }
}

export const menuRenderSignal = new RenderSignal('menuRenderSignal')

export default compose(
  signalRender(menuRenderSignal),
)(Menu)
