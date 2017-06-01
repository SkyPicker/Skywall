import * as actions from '../constants/actions'
import {makeAction} from '../utils'


export const fetchingStart = makeAction(actions.FETCHING_START, 'key')
export const fetchingStop = makeAction(actions.FETCHING_STOP, 'key')
