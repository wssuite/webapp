from src.models.jsonify import Jsonify
from src.models.db_document import DBDocument
from pykson import ListField, StringField
from constants import (
    shift_group_name,
    shift_group_shifts_list,
    profile,
    shift_group_shift_types,
)
from src.models.string_reader import StringReader

"""
The conceptual difference between a shift type and a shift
group is that a shift group can have shifts and shifts
type in its array but the shift type can only have shifts
in its array
"""


class ShiftGroup(Jsonify, DBDocument, StringReader):
    name = StringField(serialized_name=shift_group_name)
    shifts = ListField(str, serialized_name=shift_group_shifts_list)
    profile = StringField(serialized_name=profile, default_value="")
    shift_types = ListField(str, serialized_name=shift_group_shift_types)

    def db_json(self):
        return self.to_json()

    def read_shift_group(self, line, profile_name, shift_types):
        self.profile = profile_name
        self.read_line(line)
        for shift in self.shifts:
            if shift in shift_types:
                self.shift_types.append(shift)

        temp = self.shifts
        self.shifts = []
        self.shifts = [s for s in temp if s not in self.shift_types]
        return self.to_json()

    def read_line(self, line):
        tokens = line.split(',')
        self.name = tokens[0]
        self.shifts = []
        self.shift_types = []
        # temporary placing the given shifts inside the shifts array
        for i in range(1, len(tokens)):
            if tokens[i] != '':
                self.shifts.append(tokens[i])
