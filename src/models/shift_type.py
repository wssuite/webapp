from src.models.jsonify import Jsonify
from src.models.db_document import DBDocument
from constants import shift_type_name, shift_type_shifts_lists, profile
from pykson import StringField, ListField
from src.models.stringify import (
    Stringify,
    extract_string_from_simple_object_array,
)


class ShiftType(Jsonify, DBDocument, Stringify):
    name = StringField(serialized_name=shift_type_name)
    shifts = ListField(str, serialized_name=shift_type_shifts_lists)
    profile = StringField(serialized_name=profile, default_value="")

    def db_json(self):
        return self.to_json()

    def to_string(self):
        shifts_string = extract_string_from_simple_object_array(self.shifts)
        return f"{self.name},{len(self.shifts)}{shifts_string}\n"
