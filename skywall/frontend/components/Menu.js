import React from 'react'
import {Nav, NavItem, Col} from 'react-bootstrap'
import {IndexLinkContainer} from 'react-router-bootstrap'


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
        </Nav>
      </Col>
    )
  }
}

export default Menu
