import * as routes from '../constants/routes'
import {api} from '../utils'
import {Signal} from '../utils/signals'
import {alertsError, alertsRemove} from './alerts'
import {fetchingStart, fetchingStop} from './fetching'
import {getClients} from './clients'


export const beforeGroupAdd = new Signal('beforeGroupAdd')
export const afterGroupAdd = new Signal('afterGroupAdd')
export const beforeGroupUpdate = new Signal('beforeGroupUpdate')
export const afterGroupUpdate = new Signal('afterGroupUpdate')
export const beforeGroupDelete = new Signal('beforeGroupDelete')
export const afterGroupDelete = new Signal('afterGroupDelete')


export const groupAdd = (data) => (dispatch) => {
  beforeGroupAdd.emit({data, dispatch})
  dispatch(fetchingStart('groupAdd'))
  return api('POST', routes.API_GROUP_ADD, {data})
    .then(async (data) => {
      await dispatch(getClients())
      dispatch(fetchingStop('groupAdd'))
      dispatch(alertsRemove('groupAdd'))
      afterGroupAdd.emit({ok: true, data, dispatch})
      return {ok: true, data}
    })
    .catch((err) => {
      dispatch(fetchingStop('groupAdd'))
      dispatch(alertsError('groupAdd', 'Group add failed', err))
      dispatch(getClients())
      afterGroupAdd.emit({ok: false, dispatch})
      return {ok: false}
    })
}

export const groupUpdate = (groupId, data) => (dispatch) => {
  beforeGroupUpdate.emit({groupId, data, dispatch})
  dispatch(fetchingStart('groupUpdate'))
  return api('PUT', routes.API_GROUP_UPDATE, {params: {groupId}, data})
    .then(async (data) => {
      await dispatch(getClients())
      dispatch(fetchingStop('groupUpdate'))
      dispatch(alertsRemove('groupUpdate'))
      afterGroupUpdate.emit({ok: true, dispatch})
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('groupUpdate'))
      dispatch(alertsError('groupUpdate', 'Group update failed', err))
      dispatch(getClients())
      afterGroupUpdate.emit({ok: false, dispatch})
      return {ok: false}
    })
}

export const groupDelete = (groupId) => (dispatch) => {
  beforeGroupDelete.emit({groupId, dispatch})
  dispatch(fetchingStart('groupDelete'))
  return api('DELETE', routes.API_GROUP_DELETE, {params: {groupId}})
    .then(async (data) => {
      await dispatch(getClients())
      dispatch(fetchingStop('groupDelete'))
      dispatch(alertsRemove('groupDelete'))
      afterGroupDelete.emit({ok: true, dispatch})
      return {ok: true}
    })
    .catch((err) => {
      dispatch(fetchingStop('groupDelete'))
      dispatch(alertsError('groupDelete', 'Group delete failed', err))
      dispatch(getClients())
      afterGroupDelete.emit({ok: false, dispatch})
      return {ok: false}
    })
}
