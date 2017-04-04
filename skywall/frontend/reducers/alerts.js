import * as actions from '../constants/actions'


const initialState = {
  alerts: [],
}

export default function alerts(state = initialState, action) {
  switch (action.type) {
    case actions.ALERTS_ADD:
      return {
        ...state,
        alerts: state.alerts.filter((o) => !o.key || o.key !== action.key).concat([{
          level: action.level,
          key: action.key,
          title: action.title,
          message: action.message,
        }]),
      }
    case actions.ALERTS_REMOVE:
      return {
        ...state,
        alerts: state.alerts.filter((o) => !o.key || o.key !== action.key),
      }
    case actions.ALERTS_CLOSE:
      return {
        ...state,
        alerts: state.alerts.slice(0, action.index).concat(state.alerts.slice(action.index + 1)),
      }
    case actions.ALERTS_CLEAN:
      return {
        ...state,
        alerts: [],
      }
    default:
      return state
  }
}
