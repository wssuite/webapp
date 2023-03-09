from src.models.jsonify import Jsonify
from pykson import ListField
from constants import pattern_element_shift, pattern_element_day


class PatternElement(Jsonify):
    shift = ListField(str, serialized_name=pattern_element_shift)
    day = ListField(str, serialized_name=pattern_element_day)

    def get_shift(self):
        return self.shift
