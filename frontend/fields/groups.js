import {find} from 'lodash'
import {TextField} from '../utils/fields'


export class GroupName extends TextField {
  constructor(opts = {}) {
    super({
      label: 'Name *',
      validate: (value) => {
        if (!value) {
          return {valid: false, state: 'error', help: 'Name is required'}
        }
        if (!(/^\w+$/).test(value)) {
          return {valid: false, state: 'error', help: 'Name may contain only numbers and letters'}
        }
        if (value.toLowerCase() === 'default') {
          return {valid: false, state: 'error', help: 'Name "default" is reserverd'}
        }
        const editedGroup = this.opts.group()
        const conflictingGroup = find(this.opts.groups(), {name: value})
        if (conflictingGroup && (!editedGroup || conflictingGroup.id !== editedGroup.id)) {
          return {valid: false, state: 'error', help: 'Name already used by another group'}
        }
        return {valid: true, state: 'success'}
      },
      ...opts,
    })
    this.opts.group = opts.group || (() => null)
    this.opts.groups = opts.groups || (() => [])
  }
}

export class GroupDescription extends TextField {
  constructor(opts = {}) {
    super({
      label: 'Description',
      ...opts,
    })
  }
}
