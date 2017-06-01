import * as actions from '../constants/actions'
import * as routes from '../constants/routes'
import {makeAction, api} from '../utils'
import {alertsError, alertsRemove} from './alerts'
import {getClients} from './clients'


export const clientUpdateRequest = makeAction(actions.CLIENT_UPDATE_REQUEST)
export const clientUpdateSuccess = makeAction(actions.CLIENT_UPDATE_SUCCESS, 'data')
export const clientUpdateFailure = makeAction(actions.CLIENT_UPDATE_FAILURE, 'error')

export const clientUpdate = (clientId, data) => {
  return (dispatch) => {
    dispatch(clientUpdateRequest())
    return api('PUT', routes.API_CLIENT_UPDATE, {params: {clientId}, data})
      .then((data) => {
        dispatch(clientUpdateSuccess(data))
        dispatch(alertsRemove('clientUpdate'))
        dispatch(getClients())
        return {ok: true}
      })
      .catch((err) => {
        dispatch(clientUpdateFailure(err))
        dispatch(alertsError('clientUpdate', 'Client update failed', err))
        dispatch(getClients())
        return {ok: false}
      })
  }
}
