from src.models.jsonify import Jsonify
from src.models.db_document import DBDocument
from pykson import ListField, StringField
from constants import (
    shift_group_name,
    shift_group_shifts_list,
    profile,
    shift_group_shift_types,
)

"""
The conceptual difference between a shift type and a shift
group is that a shift group can have shifts and shifts
type in its array but the shift type can only have shifts
in its array
"""


class ShiftGroup(Jsonify, DBDocument):
    name = StringField(serialized_name=shift_group_name)
    shifts = ListField(str, serialized_name=shift_group_shifts_list)
    profile = StringField(serialized_name=profile, default_value="")
    shift_types = ListField(str, serialized_name=shift_group_shift_types)

    def db_json(self):
        return self.to_json()
