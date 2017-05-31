import React from 'react'
import {compose} from 'redux'
import {notFoundRenderSignal} from '../signals'
import signalRender from '../hocs/signalRender'


class NotFound extends React.Component {

  static propTypes = {
  }

  render() {
    return (
      <div>
        <p>Page not found</p>
      </div>
    )
  }
}

export default compose(
  signalRender(notFoundRenderSignal),
)(NotFound)
