import React from 'react'
import {Col, Row} from 'react-bootstrap'
import PropTypes from 'prop-types'
import {compose} from 'redux'
import {withMenuRenderSignal} from '../signals'
import signalRender from '../hocs/signalRender'
import Menu from './Menu'


class WithMenu extends React.Component {

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
  signalRender(withMenuRenderSignal),
)(WithMenu)
