from src.models.db_document import DBDocument
from src.models.jsonify import Jsonify
from pykson import StringField
from constants import (shift_name,
                       shift_start_time,
                       shift_end_time, profile)


class Shift(Jsonify, DBDocument):
    name = StringField(serialized_name=shift_name)
    start_time = StringField(serialized_name=shift_start_time)
    end_time = StringField(serialized_name=shift_end_time)
    profile = StringField(serialized_name=profile, default_value="")

    def db_json(self):
        return self.to_json()
