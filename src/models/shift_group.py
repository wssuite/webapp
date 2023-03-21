from src.models.exporter import CSVExporter
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
from src.utils.import_util import sanitize_array, Wrapper
from src.models.stringify import (
    Stringify,
    extract_string_from_simple_object_array,
)

"""
The conceptual difference between a shift type and a shift
group is that a shift group can have shifts and shifts
type in its array but the shift type can only have shifts
in its array
"""


class ShiftGroup(Jsonify, DBDocument, Stringify, StringReader, CSVExporter):
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
        return self

    def read_line(self, line):
        tokens = line.split(",")
        tokens = sanitize_array(tokens)
        wrapper = Wrapper(tokens)
        self.name = wrapper.get_by_index(0)
        self.shifts = []
        self.shift_types = []
        # temporary placing the given shifts inside the shifts array
        for i in range(1, len(tokens)):
            self.shifts.append(wrapper.get_by_index(i))

    def to_string(self):
        shifts_string = extract_string_from_simple_object_array(self.shifts)
        shift_types_string = extract_string_from_simple_object_array(
            self.shift_types
        )
        return (
            f"{self.name},{len(self.shifts)}{shifts_string},"
            f"{len(self.shift_types)}{shift_types_string}\n"
        )

    def export(self):
        shifts_string = extract_string_from_simple_object_array(self.shifts)
        shift_types_string = extract_string_from_simple_object_array(
            self.shift_types
        )
        return f"{self.name}{shifts_string}{shift_types_string}\n"
