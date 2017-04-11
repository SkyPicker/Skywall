import moment from 'moment'
import * as actions from '../constants/actions'


const initialState = {
  isFetching: false,
  lastFetch: null,
  clients: null,
  reports: null,
  values: null,
  fields: null,
}

const clients = (state = initialState, action) => {
  switch (action.type) {
    case actions.CLIENTS_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case actions.CLIENTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        lastFetch: moment().valueOf(),
        clients: action.data.clients,
        reports: action.data.reports,
        values: action.data.values,
        fields: action.data.fields,
      }
    case actions.CLIENTS_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}

export default clients
