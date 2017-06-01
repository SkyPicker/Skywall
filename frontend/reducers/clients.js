import moment from 'moment'
import * as actions from '../constants/actions'


const initialState = {
  lastFetch: null,
  clients: null,
  connections: null,
  reports: null,
  values: null,
  fields: null,
}

const clients = (state = initialState, action) => {
  switch (action.type) {
    case actions.CLIENTS_SET:
      return {
        ...state,
        lastFetch: moment().valueOf(),
        clients: action.data.clients,
        connections: action.data.connections,
        reports: action.data.reports,
        values: action.data.values,
        fields: action.data.fields,
      }
    default:
      return state
  }
}

export default clients
