from src.models.jsonify import Jsonify
from src.models.db_document import DBDocument
from constants import shift_type_name, shift_type_shifts_lists
from pykson import StringField, ListField


class ShiftType(Jsonify, DBDocument):
    name = StringField(serialized_name=shift_type_name)
    shifts = ListField(str, serialized_name=shift_type_shifts_lists)

    def db_json(self):
        return self.to_json()
