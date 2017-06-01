import React from 'react'
import {Row, Col} from 'react-bootstrap'
import {compose} from 'redux'
import signalRender from '../hocs/signalRender'
import {RenderSignal} from '../utils/signals'


class Dashboard extends React.Component {

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

export const dashboardRenderSignal = new RenderSignal('dashboardRenderSignal')

export default compose(
  signalRender(dashboardRenderSignal),
)(Dashboard)
