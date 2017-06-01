import React from 'react'
import {isString, isError} from 'lodash'
import {Alert} from 'react-bootstrap'
import {If, Choose, When, Otherwise, For} from 'jsx-control-statements'
import PropTypes from 'prop-types'
import {compose, bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as alerts from '../constants/alerts'
import {alertsClose} from '../actions/alerts'
import signalRender from '../hocs/signalRender'
import {RenderSignal} from '../utils/signals'


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
      message: PropTypes.any,
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
            <Choose>
              <When condition={isError(alert.message)}>
                {alert.message.message}
              </When>
              <When condition={isString(alert.message)}>
                {alert.message}
              </When>
              <Otherwise>
                {JSON.stringify(alert.message)}
              </Otherwise>
            </Choose>
          </Alert>
        </For>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  alerts: state.alerts.alerts,
})

const mapDispatchToProps = {
  alertsClose,
}

export const alertsRenderSignal = new RenderSignal('alertsRenderSignal')

export default compose(
  connect(mapStateToProps, (dispatch) => bindActionCreators(mapDispatchToProps, dispatch)),
  signalRender(alertsRenderSignal),
)(Alerts)
