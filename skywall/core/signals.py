import weakref


class Signal:

    def __init__(self, name):
        self.name = name
        self.listeners = []

    def connect(self, listener):
        if hasattr(listener, '__self__'):
            listener_ref = weakref.WeakMethod(listener)
        else:
            listener_ref = weakref.ref(listener)
        self.listeners.append(listener_ref)
        return listener

    def disconnect(self, listener):
        self.cleanup_lost_refs()
        self.listeners = [listener_ref for listener_ref in self.listeners if listener_ref() != listener]

    def emit(self, **kwargs):
        self.cleanup_lost_refs()
        for listener_ref in self.listeners:
            listener = listener_ref()
            if listener is not None:
                listener(**kwargs)

    def cleanup_lost_refs(self):
        self.listeners = [listener_ref for listener_ref in self.listeners if listener_ref() is not None]
