from src.models.db_document import DBDocument
from src.models.jsonify import Jsonify
from pykson import StringField
from constants import shift_name, shift_start_time, shift_end_time, profile
from src.models.string_reader import StringReader
from src.utils.import_util import sanitize_array


class Shift(Jsonify, DBDocument, StringReader):
    name = StringField(serialized_name=shift_name)
    start_time = StringField(serialized_name=shift_start_time)
    end_time = StringField(serialized_name=shift_end_time)
    profile = StringField(serialized_name=profile, default_value="")

    def db_json(self):
        return self.to_json()

    def read_shift(self, line, profile_name):
        self.profile = profile_name
        return self.read_line(line)

    def read_line(self, line):
        tokens = line.split(',')
        tokens = sanitize_array(tokens)
        self.name = tokens[0]
        self.start_time = tokens[1]
        self.end_time = tokens[2]
        return self
