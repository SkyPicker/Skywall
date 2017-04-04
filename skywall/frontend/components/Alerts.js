import React from 'react'
import {Alert} from 'react-bootstrap'
import {If, For} from 'jsx-control-statements'
import * as alerts from '../constants/alerts'
import {alertsClose} from '../actions/alerts'
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
    alerts: React.PropTypes.arrayOf(React.PropTypes.shape({
      level: React.PropTypes.oneOf(alerts.LEVELS).isRequired,
      title: React.PropTypes.string,
      message: React.PropTypes.string.isRequired,
    })).isRequired,
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

export default connect(Alerts, {alertsClose}, (state) => ({
  alerts: state.alerts.alerts,
}))
