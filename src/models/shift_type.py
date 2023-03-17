from src.models.jsonify import Jsonify
from src.models.db_document import DBDocument
from constants import shift_type_name, shift_type_shifts_lists, profile
from pykson import StringField, ListField
from src.models.string_reader import StringReader
from src.utils.import_util import sanitize_array, Wrapper


class ShiftType(Jsonify, DBDocument, StringReader):
    name = StringField(serialized_name=shift_type_name)
    shifts = ListField(str, serialized_name=shift_type_shifts_lists)
    profile = StringField(serialized_name=profile, default_value="")

    def db_json(self):
        return self.to_json()

    def red_shift_type(self, line, profile_name):
        self.profile = profile_name
        return self.read_line(line)

    def read_line(self, line):
        self.shifts = []
        tokens = line.split(',')
        tokens = sanitize_array(tokens)
        wrapper = Wrapper(tokens)
        self.name = wrapper.get_by_index(0)
        for i in range(1, len(tokens)):
            if tokens[i] != '':
                self.shifts.append(wrapper.get_by_index(i))

        return self
