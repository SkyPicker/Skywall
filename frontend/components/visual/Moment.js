import React from 'react'
import {isNil, isNumber} from 'lodash'
import PropTypes from 'prop-types'
import moment from 'moment'
import {Choose, When, Otherwise} from 'jsx-control-statements'
import {EMDASH} from '../../constants/symbols'


class Moment extends React.Component {

  static propTypes = {
    at: PropTypes.any,
  }

  render() {
    const {at} = this.props
    const atMoment = isNil(at) ? null : isNumber(at) ? moment.unix(at) : moment.isMoment(at) ? at : moment(at)
    return (
      <Choose>
        <When condition={atMoment}>
          <span title={atMoment.format('LLLL')}>
            {atMoment.from()}
          </span>
        </When>
        <Otherwise>
          <span>
            {EMDASH}
          </span>
        </Otherwise>
      </Choose>
    )
  }
}

export default Moment
