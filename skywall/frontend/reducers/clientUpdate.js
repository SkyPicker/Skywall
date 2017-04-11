import * as actions from '../constants/actions'


const initialState = {
  isFetching: false,
}

const clientUpdate = (state = initialState, action) => {
  switch (action.type) {
    case actions.CLIENT_UPDATE_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case actions.CLIENT_UPDATE_SUCCESS:
      return {
        ...state,
        isFetching: false,
      }
    case actions.CLIENT_UPDATE_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}

export default clientUpdate
