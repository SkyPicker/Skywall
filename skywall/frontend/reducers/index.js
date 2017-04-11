import {combineReducers} from 'redux'
import alerts from './alerts'
import clients from './clients'
import clientUpdate from './clientUpdate'


export default combineReducers({
  alerts,
  clients,
  clientUpdate,
})
