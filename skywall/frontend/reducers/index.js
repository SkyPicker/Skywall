import {combineReducers} from 'redux'
import alerts from './alerts'
import clients from './clients'


export default combineReducers({
  alerts,
  clients,
})
