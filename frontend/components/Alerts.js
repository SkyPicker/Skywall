import React from 'react'
import {Alert} from 'react-bootstrap'
import {If, For} from 'jsx-control-statements'
import PropTypes from 'prop-types'
import * as alerts from '../constants/alerts'
import {alertsClose} from '../actions/alerts'
import {alertsRenderSignal} from '../signals'
import signalRender from '../hocs/signalRender'
import {connect} from '../utils'


const level2bsStyle = {
  [alerts.ERROR]: 'danger',
  [alerts.WARNING]: 'warning',
  [alerts.SUCCESS]: 'success',
  [alerts.INFO]: 'info',
  [alerts.DEBUG]: 'info',
}

class Alerts extends React.Component {

  static propTypes = {
    // Props from store
    alerts: PropTypes.arrayOf(PropTypes.shape({
      level: PropTypes.oneOf(alerts.LEVELS).isRequired,
      title: PropTypes.string,
      message: PropTypes.string.isRequired,
    })).isRequired,

    // Actions
    alertsClose: PropTypes.func.isRequired,
  }

  render() {
    const {alerts, alertsClose} = this.props
    return (
      <div>
        <For each="alert" index="idx" of={alerts}>
          <Alert key={idx} bsStyle={level2bsStyle[alert.level]} onDismiss={() => alertsClose(idx)}>
            <If condition={alert.title}>
              <strong>{alert.title}: </strong>
            </If>
            {alert.message}
          </Alert>
        </For>
      </div>
    )
  }
}

const SignaledAlerts = signalRender(alertsRenderSignal)(Alerts)

export default connect(SignaledAlerts, {alertsClose}, (state) => ({
  alerts: state.alerts.alerts,
}))
