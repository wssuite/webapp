from abc import abstractmethod


class StringReader:

    @abstractmethod
    def read_line(self, line):
        pass
