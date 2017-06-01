import * as actions from '../constants/actions'


const initialState = {
}

const fetching = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCHING_START:
      return {
        ...state,
        [action.key]: true,
      }
    case actions.FETCHING_STOP:
      return {
        ...state,
        [action.key]: false,
      }
    default:
      return state
  }
}

export default fetching
