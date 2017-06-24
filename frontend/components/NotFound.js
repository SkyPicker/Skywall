import React from 'react'
import {compose} from 'redux'
import {applyOverlays} from '../utils/overlays'


export class NotFoundComponent extends React.Component {

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
  applyOverlays,
)(NotFoundComponent)
