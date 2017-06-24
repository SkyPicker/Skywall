import React from 'react'
import {Row, Col} from 'react-bootstrap'
import {compose} from 'redux'
import {applyOverlays} from '../utils/overlays'


export class DashboardComponent extends React.Component {

  static propTypes = {
  }

  render() {
    return (
      <div>
        <Row>
          <Col md={6}>
            TODO
          </Col>
        </Row>
      </div>
    )
  }
}

export default compose(
  applyOverlays,
)(DashboardComponent)
