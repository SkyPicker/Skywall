import {TextField} from '../utils/fields'


export class ClientLabel extends TextField {
  constructor(opts = {}) {
    super({
      label: 'Label',
      ...opts,
    })
  }
}
