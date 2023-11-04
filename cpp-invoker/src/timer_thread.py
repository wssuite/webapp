from threading import Thread, Event


class TimerThread(Thread):
    def __init__(self, func):
        Thread.__init__(self)
        self.stopped = Event()
        self.func = func

    def run(self):
        while not self.stopped.wait(2):
            try:
                self.func()
            except Exception as e:
                print("Repeated thread caught an error:")
                print(e)
