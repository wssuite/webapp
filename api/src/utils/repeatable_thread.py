from threading import Event, Thread


class RepeatableThread(Thread):
    def __init__(self, fun, param):
        super().__init__()
        self.stop_event = Event()
        self.fun = fun
        self.param = param
        self.ret = None

    def run(self):
        while not self.stop_event.wait(5):
            self.ret = self.fun(self.param, self.ret)
