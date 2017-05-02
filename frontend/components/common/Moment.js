import React from 'react'
import moment from 'moment'


class Moment extends React.Component {

  static propTypes = {
    at: React.PropTypes.instanceOf(moment).isRequired,
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
