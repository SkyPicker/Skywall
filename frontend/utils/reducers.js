import {assign, keys, intersection, isEmpty} from 'lodash'
import invariant from 'invariant'


export const reducersRegistry = {}

export const registerReducers = (reducers) => {
  const collisions = intersection(keys(reducersRegistry), keys(reducers))
  invariant(isEmpty(collisions), 'Reducer "%s" is already registered', collisions[0])
  assign(reducersRegistry, reducers)
}
