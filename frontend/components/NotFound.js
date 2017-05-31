import React from 'react'
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

const SignaledNotFound = signalRender(notFoundRenderSignal)(NotFound)

export default SignaledNotFound
