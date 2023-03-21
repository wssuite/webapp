from src.models.exporter import CSVExporter
from src.models.db_document import DBDocument
from src.models.jsonify import Jsonify
from pykson import StringField
from constants import shift_name, shift_start_time, shift_end_time, profile
from src.models.string_reader import StringReader
from src.utils.import_util import sanitize_array, Wrapper

from src.models.stringify import Stringify


class Shift(Jsonify, DBDocument, Stringify, StringReader, CSVExporter):
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
        tokens = line.split(",")
        tokens = sanitize_array(tokens)
        wrapper = Wrapper(tokens)
        self.name = wrapper.get_by_index(0)
        self.start_time = wrapper.get_by_index(1)
        self.end_time = wrapper.get_by_index(2)
        return self

    def to_string(self):
        return f"{self.name},{self.start_time},{self.end_time}\n"

    def export(self):
        return self.to_string()
