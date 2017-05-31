import React from 'react'
import {Nav, NavItem, Col} from 'react-bootstrap'
import {LinkContainer, IndexLinkContainer} from 'react-router-bootstrap'
import * as routes from '../constants/routes'
import {menuRenderSignal} from '../signals'
import signalRender from '../hocs/signalRender'


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
          <LinkContainer to={routes.CLIENTS}>
            <NavItem>Clients</NavItem>
          </LinkContainer>
        </Nav>
      </Col>
    )
  }
}

const SignaledMenu = signalRender(menuRenderSignal)(Menu)

export default SignaledMenu
