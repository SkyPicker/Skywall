import getDisplayName from 'react-display-name'


export const overlaysRegistry = new Map()

export const registerOverlay = (component, overlay) => {
  if (overlaysRegistry.has(component)) {
    overlaysRegistry.get(component).push(overlay)
  } else {
    overlaysRegistry.set(component, [overlay])
  }
}

export const applyOverlays = (WrappedComponent) => {
  class Overlay extends WrappedComponent {
    static displayName = `Overlay(${getDisplayName(WrappedComponent)})`
    render() {
      const overlays = overlaysRegistry.get(WrappedComponent) || []
      return overlays.reduce((rendered, overlay) => overlay(rendered, this), super.render())
    }
  }
  return Overlay
}
