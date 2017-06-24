import {pull} from 'lodash'


export class Signal {
  constructor(name) {
    this.name = name
    this.listeners = []
  }
  connect(listener) {
    this.listeners.push(listener)
    return listener
  }
  disconnect(listener) {
    pull(this.listeners, listener)
  }
  emit(arg) {
    for (const listener of this.listeners) {
      listener(arg)
    }
  }
}
