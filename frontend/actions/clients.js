import moment from 'moment'
import {RENEW_INTERVAL} from '../constants'
import * as actions from '../constants/actions'
import * as routes from '../constants/routes'
import {makeAction, api} from '../utils'
import {alertsError, alertsRemove} from './alerts'
import {fetchingStart, fetchingStop} from './fetching'


export const clientsSet = makeAction(actions.CLIENTS_SET, 'data')

export const getClients = () => (dispatch) => {
  dispatch(fetchingStart('clients'))
  return api('GET', routes.API_CLIENT_LIST)
    .then((data) => {
      dispatch(fetchingStop('clients'))
      dispatch(alertsRemove('clients'))
      dispatch(clientsSet(data))
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('clients'))
      dispatch(alertsError('clients', 'Fetching clients failed', err))
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
  dispatch(fetchingStart('clientUpdate'))
  return api('PUT', routes.API_CLIENT_UPDATE, {params: {clientId}, data})
    .then((data) => {
      dispatch(fetchingStop('clientUpdate'))
      dispatch(alertsRemove('clientUpdate'))
      dispatch(getClients())
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('clientUpdate'))
      dispatch(alertsError('clientUpdate', 'Client update failed', err))
      dispatch(getClients())
      return {ok: false}
    })
}
