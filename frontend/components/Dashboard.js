import React from 'react'
import {Row, Col} from 'react-bootstrap'
import {dashboardRenderSignal} from '../signals'
import signalRender from '../hocs/signalRender'


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

const SignaledDashboard = signalRender(dashboardRenderSignal)(Dashboard)

export default SignaledDashboard
