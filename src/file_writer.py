import json
import multiprocessing


class FileManager:
    read_lock = multiprocessing.Lock()
    write_lock = multiprocessing.Lock()

    def __init__(self, running):
        self.file_name = running

    def read(self):
        with FileManager.read_lock:
            f = open(self.file_name)
            data = json.load(f)
            f.close()
            return data

    def write(self, data):
        with open(self.file_name, "w") as f:
            with FileManager.write_lock:
                json.dump(data, f)
