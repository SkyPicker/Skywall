import {toInteger, sortBy} from 'lodash'
import {formatPattern} from 'react-router'
import * as routes from '../constants/routes'
import {SelectBox} from '../utils/fields'
import {groupLabel, defaultGroupLabel} from '../utils/humanize'


export class SelectGroup extends SelectBox {
  constructor(opts = {}) {
    super({
      label: 'Group',
      format: (value) => value && toInteger(value) || null,
      options: () => this.getOptions(),
      show: (value) => value ? formatPattern(routes.GROUP_DETAIL, {groupId: value}) : routes.GROUP_DEFAULT,
      ...opts,
    })
    this.opts.groups = opts.groups || (() => [])
  }
  getOptions() {
    const options = this.opts.groups().map((group) => ({
      value: group.id,
      label: groupLabel(group),
    }))
    const optionsSorted = sortBy(options, (option) => option.label.toLowerCase())
    return [
      {value: '', label: defaultGroupLabel},
      ...optionsSorted,
    ]
  }
}
