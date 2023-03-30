from threading import Event, Thread


class RepeatableThread(Thread):
    def __init__(self, fun, param):
        super().__init__()
        self.stop_event = Event()
        self.fun = fun
        self.param = param

    def run(self):
        while not self.stop_event.wait(0.5):
            self.fun(self.param)
