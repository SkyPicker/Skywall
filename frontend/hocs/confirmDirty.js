import React from 'react'
import {pull} from 'lodash'
import {withRouter} from 'react-router'
import getDisplayName from 'react-display-name'
import PropTypes from 'prop-types'


const confirmDirty = (WrappedComponent) => {
  class ConfirmDirty extends React.Component {
    static displayName = `ConfirmDirty(${getDisplayName(WrappedComponent)})`
    static propTypes = {
      route: PropTypes.object.isRequired,
      router: PropTypes.shape({
        setRouteLeaveHook: PropTypes.func.isRequired,
      }).isRequired,
    }
    constructor(props) {
      super(props)
      this.hooks = []
      this.resetLeaveHook = null
      this.registerDirty = this.registerDirty.bind(this)
    }
    componentDidMount() {
      this.resetLeaveHook = this.props.router.setRouteLeaveHook(this.props.route, () => {
        for (const hook of this.hooks) {
          const dirty = hook()
          if (dirty) return dirty
        }
      })
    }
    componentWillUnmount() {
      this.resetLeaveHook()
    }
    registerDirty(hook) {
      this.hooks.push(hook)
      return () => pull(this.hooks, hook)
    }
    render() {
      return (
        <WrappedComponent {...this.props} registerDirty={this.registerDirty} />
      )
    }
  }
  return withRouter(ConfirmDirty)
}

export default confirmDirty
