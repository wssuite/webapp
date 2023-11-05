from threading import Lock
from multiprocessing import Process

from typing import Dict


class ProtectedDict:
    def __init__(self):
        self.target_dict: Dict[str, Process] = {}
        self.lock = Lock()

    def add_item(self, key, value):
        with self.lock:
            self.target_dict[key] = value

    def pop_item(self, key):
        with self.lock:
            return self.target_dict.pop(key, None)

    def get_item(self, key):
        with self.lock:
            return self.target_dict.get(key, None)

    def values(self):
        with self.lock:
            return self.target_dict.values()

    def keys(self):
        with self.lock:
            return self.target_dict.keys()
