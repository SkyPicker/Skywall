import {combineReducers} from 'redux'
import {FlowSignal} from '../utils/signals'
import alerts from './alerts'
import fetching from './fetching'
import clients from './clients'


export const reducersSignal = new FlowSignal('reducersSignal')

export default () => combineReducers(reducersSignal.emit({
  alerts,
  fetching,
  clients,
}))
