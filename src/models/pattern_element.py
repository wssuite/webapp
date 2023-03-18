from src.models.jsonify import Jsonify
from pykson import ListField
from constants import pattern_element_shift, pattern_element_day
from src.models.stringify import Stringify


class PatternElement(Jsonify, Stringify):
    shifts = ListField(str, serialized_name=pattern_element_shift)
    days = ListField(str, serialized_name=pattern_element_day)

    def get_shift(self):
        return self.shifts

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
