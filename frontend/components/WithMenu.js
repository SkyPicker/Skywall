import React from 'react'
import {Col, Row} from 'react-bootstrap'
import PropTypes from 'prop-types'
import {compose} from 'redux'
import {applyOverlays} from '../utils/overlays'
import Menu from './Menu'


export class WithMenuComponent extends React.Component {

  static propTypes = {
    // Default props
    children: PropTypes.node,
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

export default compose(
  applyOverlays,
)(WithMenuComponent)
