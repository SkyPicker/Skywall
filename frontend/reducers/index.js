import {combineReducers} from 'redux'
import alerts from './alerts'
import fetching from './fetching'
import clients from './clients'


export default combineReducers({
  alerts,
  fetching,
  clients,
})
