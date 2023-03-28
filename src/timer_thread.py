from threading import Thread, Event
from .handler import schedule_waiting


class TimerThread(Thread):
    def __init__(self, event: Event):
        Thread.__init__(self)
        self.stopped = event

    def run(self):
        while not self.stopped.wait(2):
            schedule_waiting()
