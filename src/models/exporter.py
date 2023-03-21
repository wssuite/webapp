from abc import abstractmethod


class CSVExporter:
    @abstractmethod
    def export(self):
        pass
