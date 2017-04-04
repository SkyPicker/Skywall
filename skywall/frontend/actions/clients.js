import * as actions from '../constants/actions'
import {makeAction, api} from '../utils'
import {alertsError, alertsRemove} from './alerts'


export const clientsRequest = makeAction(actions.CLIENTS_REQUEST)
export const clientsSuccess = makeAction(actions.CLIENTS_SUCCESS, 'data')
export const clientsFailure = makeAction(actions.CLIENTS_FAILURE, 'error')

export function getClients() {
  return (dispatch) => {
    dispatch(alertsRemove('clients'))
    dispatch(clientsRequest())
    return api('GET /clients')
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
