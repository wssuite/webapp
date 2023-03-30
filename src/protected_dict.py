from threading import Lock
from multiprocessing import Process

from typing import Dict


class ProtectedDict:
    target_dict: Dict[str, Process] = {}
    lock = Lock()

    @staticmethod
    def add_item(key, value):
        with ProtectedDict.lock:
            ProtectedDict.target_dict[key] = value

    @staticmethod
    def pop_item(key):
        with ProtectedDict.lock:
            return ProtectedDict.target_dict.pop(key)
