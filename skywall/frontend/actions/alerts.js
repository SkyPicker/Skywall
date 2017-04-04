import * as actions from '../constants/actions'
import * as alerts from '../constants/alerts'
import {makeAction} from '../utils'


export const alertsAdd = makeAction(actions.ALERTS_ADD, 'key', 'level', 'title', 'message')
export const alertsRemove = makeAction(actions.ALERTS_REMOVE, 'key')
export const alertsClose = makeAction(actions.ALERTS_CLOSE, 'index')
export const alertsClean = makeAction(actions.ALERTS_CLEAN)

export const alertsError = (key, title, message) => alertsAdd(key, alerts.ERROR, title, message)
export const alertsWarning = (key, title, message) => alertsAdd(key, alerts.WARNING, title, message)
export const alertsSuccess = (key, title, message) => alertsAdd(key, alerts.SUCCESS, title, message)
export const alertsInfo = (key, title, message) => alertsAdd(key, alerts.INFO, title, message)
export const alertsDebug = (key, title, message) => alertsAdd(key, alerts.DEBUG, title, message)
