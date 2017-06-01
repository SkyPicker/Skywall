import React from 'react'
import {compose} from 'redux'
import signalRender from '../hocs/signalRender'
import {RenderSignal} from '../utils/signals'


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

export const notFoundRenderSignal = new RenderSignal('notFoundRenderSignal')

export default compose(
  signalRender(notFoundRenderSignal),
)(NotFound)
