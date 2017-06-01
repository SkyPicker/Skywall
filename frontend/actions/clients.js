import moment from 'moment'
import {RENEW_INTERVAL} from '../constants'
import * as actions from '../constants/actions'
import * as routes from '../constants/routes'
import {makeAction, api} from '../utils'
import {alertsError, alertsRemove} from './alerts'


export const clientsRequest = makeAction(actions.CLIENTS_REQUEST)
export const clientsSuccess = makeAction(actions.CLIENTS_SUCCESS, 'data')
export const clientsFailure = makeAction(actions.CLIENTS_FAILURE, 'error')

export const getClients = () => {
  return (dispatch) => {
    dispatch(clientsRequest())
    return api('GET', routes.API_CLIENT_LIST)
      .then((data) => {
        dispatch(clientsSuccess(data))
        dispatch(alertsRemove('clients'))
        return {ok: true}
      })
      .catch((err) => {
        dispatch(clientsFailure(err))
        dispatch(alertsError('clients', 'Fetching clients failed', err))
        return {ok: false}
      })
  }
}

export const renewClients = () => {
  return (dispatch, getState) => {
    const {lastFetch} = getState().clients
    const recent = moment().subtract(RENEW_INTERVAL)
    if (!lastFetch || moment(lastFetch).isBefore(recent)) {
      dispatch(getClients())
    }
  }
}
