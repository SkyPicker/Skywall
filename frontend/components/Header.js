import React from 'react'
import {Navbar, Nav, NavItem} from 'react-bootstrap'
import {Link} from 'react-router'
import {compose} from 'redux'
import {applyOverlays} from '../utils/overlays'


export class HeaderComponent extends React.Component {

  static propTypes = {
  }

  render() {
    return (
      <div>
        <header>
          <Navbar fixedTop>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/">Skywall</Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav pullRight>
                <NavItem href="#">TODO</NavItem>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </header>
        <div style={{padding: '35px'}} />
      </div>
    )
  }
}

export default compose(
  applyOverlays,
)(HeaderComponent)
