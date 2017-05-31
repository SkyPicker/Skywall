
const signalRender = (signal) => (WrappedComponent) => {
  class SignalRender extends WrappedComponent {
    render() {
      return signal.emit(this, super.render())
    }
  }
  return SignalRender
}

export default signalRender
