from src.models.exporter import CSVExporter
from src.models.jsonify import Jsonify
from pykson import ListField
from constants import pattern_element_shift, pattern_element_day
from src.models.string_reader import StringReader
from src.models.stringify import Stringify


class PatternElement(Jsonify, Stringify, StringReader, CSVExporter):
    def export(self):
        days_string = ""
        for i in range(0, len(self.days)):
            days_string += self.days[i]
            if i < len(self.days) - 1:
                days_string += "|"
        days_string += ""
        shifts_string = ""
        for i in range(0, len(self.shifts)):
            shifts_string += self.shifts[i]
            if i < len(self.shifts) - 1:
                shifts_string += "|"
        shifts_string += ""
        return f"{days_string},{shifts_string}"

    shifts = ListField(str, serialized_name=pattern_element_shift)
    days = ListField(str, serialized_name=pattern_element_day)

    def get_shift(self):
        return self.shifts

    def read_line(self, line):
        tokens = line.split(",")
        self.days = tokens[0].split("|")
        self.shifts = tokens[1].split("|")
        return self

    def to_string(self):
        days_string = ""
        for i in range(0, len(self.days)):
            days_string += self.days[i]
            if i < len(self.days) - 1:
                days_string += "|"
        days_string += ""
        shifts_string = ""
        for i in range(0, len(self.shifts)):
            shifts_string += self.shifts[i]
            if i < len(self.shifts) - 1:
                shifts_string += "|"
        shifts_string += ""
        return f"{days_string};{shifts_string}"

    def repr(self):
        return f"{self.to_string()}"
