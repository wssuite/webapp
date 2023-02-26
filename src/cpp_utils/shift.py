from src.utils.db_document import DBDocument
from src.cpp_utils.jsonify import Jsonify
from pykson import StringField
from constants import (shift_name,
                       shift_start_time,
                       shift_end_time)


class Shift(Jsonify, DBDocument):
    name = StringField(serialized_name=shift_name)
    startTime = StringField(serialized_name=shift_start_time)
    endTime = StringField(serialized_name=shift_end_time)

    def db_json(self):
        return self.to_json()
