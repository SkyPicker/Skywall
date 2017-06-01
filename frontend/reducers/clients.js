import moment from 'moment'
import * as actions from '../constants/actions'


const initialState = {
  lastFetch: null,
  data: {},
}

const clients = (state = initialState, action) => {
  switch (action.type) {
    case actions.CLIENTS_SET:
      return {
        ...state,
        lastFetch: moment().valueOf(),
        data: action.data,
      }
    default:
      return state
  }
}

export default clients
