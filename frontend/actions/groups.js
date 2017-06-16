import * as routes from '../constants/routes'
import {api} from '../utils'
import {alertsError, alertsRemove} from './alerts'
import {fetchingStart, fetchingStop} from './fetching'
import {getClients} from './clients'


export const groupAdd = (data) => (dispatch) => {
  dispatch(fetchingStart('groupAdd'))
  return api('POST', routes.API_GROUP_ADD, {data})
    .then(async (data) => {
      await dispatch(getClients())
      dispatch(fetchingStop('groupAdd'))
      dispatch(alertsRemove('groupAdd'))
      return {ok: true, data}
    })
    .catch((err) => {
      dispatch(fetchingStop('groupAdd'))
      dispatch(alertsError('groupAdd', 'Group add failed', err))
      dispatch(getClients())
      return {ok: false}
    })
}

export const groupUpdate = (groupId, data) => (dispatch) => {
  dispatch(fetchingStart('groupUpdate'))
  return api('PUT', routes.API_GROUP_UPDATE, {params: {groupId}, data})
    .then(async (data) => {
      await dispatch(getClients())
      dispatch(fetchingStop('groupUpdate'))
      dispatch(alertsRemove('groupUpdate'))
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('groupUpdate'))
      dispatch(alertsError('groupUpdate', 'Group update failed', err))
      dispatch(getClients())
      return {ok: false}
    })
}

export const groupDelete = (groupId) => (dispatch) => {
  dispatch(fetchingStart('groupDelete'))
  return api('DELETE', routes.API_GROUP_DELETE, {params: {groupId}})
    .then(async (data) => {
      await dispatch(getClients())
      dispatch(fetchingStop('groupDelete'))
      dispatch(alertsRemove('groupDelete'))
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('groupDelete'))
      dispatch(alertsError('groupDelete', 'Group delete failed', err))
      dispatch(getClients())
      return {ok: false}
    })
}
