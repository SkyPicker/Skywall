import {combineReducers} from 'redux'
import {FlowSignal} from '../utils/signals'
import alerts from './alerts'
import clients from './clients'
import fetching from './fetching'


export const reducersSignal = new FlowSignal('reducersSignal')

export default () => combineReducers(reducersSignal.emit({
  alerts,
  clients,
  fetching,
}))
