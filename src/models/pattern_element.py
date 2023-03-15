from src.models.jsonify import Jsonify
from pykson import ListField
from constants import pattern_element_shift, pattern_element_day
from src.models.string_reader import StringReader


class PatternElement(Jsonify, StringReader):
    shifts = ListField(str, serialized_name=pattern_element_shift)
    days = ListField(str, serialized_name=pattern_element_day)

    def get_shift(self):
        return self.shifts

    def read_line(self, line):
        tokens = line.split(',')
        self.days = tokens[0].split('|')
        self.shifts = tokens[1].split('|')
        return self.to_json()
