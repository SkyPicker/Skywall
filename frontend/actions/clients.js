import moment from 'moment'
import {RENEW_INTERVAL} from '../constants'
import * as actions from '../constants/actions'
import * as routes from '../constants/routes'
import {makeAction, api} from '../utils'
import {Signal} from '../utils/signals'
import {alertsError, alertsRemove} from './alerts'
import {fetchingStart, fetchingStop} from './fetching'


export const beforeGetClients = new Signal('beforeGetClients')
export const afterGetClients = new Signal('afterGetClients')
export const beforeClientUpdate = new Signal('beforeClientUpdate')
export const afterClientUpdate = new Signal('afterClientUpdate')


export const clientsSet = makeAction(actions.CLIENTS_SET, 'data')

export const getClients = () => (dispatch) => {
  beforeGetClients.emit({dispatch})
  dispatch(fetchingStart('clients'))
  return api('GET', routes.API_CLIENT_LIST)
    .then((data) => {
      dispatch(fetchingStop('clients'))
      dispatch(alertsRemove('clients'))
      dispatch(clientsSet(data))
      afterGetClients.emit({ok: true, dispatch})
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('clients'))
      dispatch(alertsError('clients', 'Fetching clients failed', err))
      afterGetClients.emit({ok: false, dispatch})
      return {ok: false}
    })
}

export const renewClients = () => (dispatch, getState) => {
  // Don't try to renew in parallel
  if (getState().fetching.clients) return

  const {lastFetch} = getState().clients
  if (!lastFetch || moment(lastFetch).add(RENEW_INTERVAL).isBefore()) {
    dispatch(getClients())
  }
}

export const clientUpdate = (clientId, data) => (dispatch) => {
  beforeClientUpdate.emit({clientId, data, dispatch})
  dispatch(fetchingStart('clientUpdate'))
  return api('PUT', routes.API_CLIENT_UPDATE, {params: {clientId}, data})
    .then(async (data) => {
      await dispatch(getClients())
      dispatch(fetchingStop('clientUpdate'))
      dispatch(alertsRemove('clientUpdate'))
      afterClientUpdate.emit({ok: true, dispatch})
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('clientUpdate'))
      dispatch(alertsError('clientUpdate', 'Client update failed', err))
      dispatch(getClients())
      afterClientUpdate.emit({ok: false, dispatch})
      return {ok: false}
    })
}
