import {combineReducers} from 'redux'
import {reducersRegistry, registerReducers} from '../utils/reducers'
import alerts from './alerts'
import clients from './clients'
import fetching from './fetching'


registerReducers({
  alerts,
  clients,
  fetching,
})

export default () => combineReducers(reducersRegistry)
