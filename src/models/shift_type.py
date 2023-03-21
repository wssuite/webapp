from src.models.exporter import CSVExporter
from src.models.jsonify import Jsonify
from src.models.db_document import DBDocument
from constants import shift_type_name, shift_type_shifts_lists, profile
from pykson import StringField, ListField
from src.models.string_reader import StringReader
from src.utils.import_util import sanitize_array, Wrapper

from src.models.stringify import (
    Stringify,
    extract_string_from_simple_object_array,
)


class ShiftType(Jsonify, DBDocument, Stringify, StringReader, CSVExporter):
    name = StringField(serialized_name=shift_type_name)
    shifts = ListField(str, serialized_name=shift_type_shifts_lists)
    profile = StringField(serialized_name=profile, default_value="")

    def db_json(self):
        return self.to_json()

    def read_shift_type(self, line, profile_name):
        self.profile = profile_name
        return self.read_line(line)

    def read_line(self, line):
        self.shifts = []
        tokens = line.split(",")
        tokens = sanitize_array(tokens)
        wrapper = Wrapper(tokens)
        self.name = wrapper.get_by_index(0)
        for i in range(1, len(tokens)):
            if tokens[i] != "":
                self.shifts.append(wrapper.get_by_index(i))

        return self

    def to_string(self):
        shifts_string = extract_string_from_simple_object_array(self.shifts)
        return f"{self.name},{len(self.shifts)}{shifts_string}\n"

    def export(self):
        shifts_string = extract_string_from_simple_object_array(self.shifts)
        return f"{self.name}{shifts_string}\n"
