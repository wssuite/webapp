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
        f = open(self.file_name, "w")
        with FileManager.write_lock:
            json.dump(data, f)
        f.close()

    def pop_first_item(self):
        data: dict = self.read()
        if len(data) > 0:
            first_key = next(iter(data))
            print(first_key)
            value = data.pop(first_key)
            self.write(data)
            return first_key, value
        return None

    def add_item(self, key, value):
        data: dict = self.read()
        data[key] = value
        self.write(data)

    def pop_item_by_key(self, key):
        data: dict = self.read()
        data.pop(key, None)
        self.write(data)

    def len(self):
        data: dict = self.read()
        return len(data)
