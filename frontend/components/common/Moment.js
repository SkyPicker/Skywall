import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'


class Moment extends React.Component {

  static propTypes = {
    at: PropTypes.instanceOf(moment).isRequired,
  }

  render() {
    const {at} = this.props
    return (
      <span title={at.format('LLLL')}>
        {at.from()}
      </span>
    )
  }
}

export default Moment
