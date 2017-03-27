import {bindActionCreators} from 'redux'
import {connect as originalConnect} from 'react-redux'


export function dummyMiddleware() {
  return (next) => (action) => next(action)
}

export function connect(component, mapDispatchToProps, mapStateToProps, options) {
  return originalConnect(mapStateToProps,
    (dispatch) => bindActionCreators(mapDispatchToProps, dispatch), null, options)(component)
}
