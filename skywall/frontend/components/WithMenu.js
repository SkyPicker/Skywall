import React from 'react'
import {Col, Row} from 'react-bootstrap'
import Menu from './Menu'


class WithMenu extends React.Component {

  static propTypes = {
    // Default props
    children: React.PropTypes.any,
  }

  render() {
    const {children} = this.props
    return (
      <Row>
        <Menu />
        <Col sm={9} xs={12}>
          {React.cloneElement(children)}
        </Col>
      </Row>
    )
  }
}

export default WithMenu
