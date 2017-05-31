import getDisplayName from 'react-display-name'


const signalRender = (signal) => (WrappedComponent) => {
  class SignalRender extends WrappedComponent {
    static displayName = `SignalRender(${getDisplayName(WrappedComponent)})`
    render() {
      return signal.emit(this, super.render())
    }
  }
  return SignalRender
}

export default signalRender
