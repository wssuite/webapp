from abc import abstractmethod


class BaseImporter:
    @abstractmethod
    def read_file(self, file_name):
        pass
