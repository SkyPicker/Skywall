import React from 'react'
import {Col, Row} from 'react-bootstrap'
import Menu from './Menu'


class WithMenu extends React.Component {

  static propTypes = {
  }

  render() {
    let {children} = this.props
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
