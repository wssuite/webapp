from src.models.jsonify import Jsonify
from pykson import ListField
from constants import pattern_element_shift, pattern_element_day


class PatternElement(Jsonify):
    shifts = ListField(str, serialized_name=pattern_element_shift)
    days = ListField(str, serialized_name=pattern_element_day)

    def get_shift(self):
        return self.shifts
