from src.models.exporter import CSVExporter
from src.models.jsonify import Jsonify
from src.models.db_document import DBDocument
from pykson import StringField
from constants import skill_name, profile
from src.models.string_reader import StringReader
from src.models.stringify import Stringify


class Skill(Jsonify, DBDocument, Stringify, StringReader, CSVExporter):
    name = StringField(serialized_name=skill_name)
    profile = StringField(serialized_name=profile, default_value="")

    def db_json(self) -> dict:
        return self.to_json()

    def read_skill(self, line, profile_name):
        self.profile = profile_name
        return self.read_line(line)

    def read_line(self, line):
        self.name = line
        return self

    def to_string(self):
        return f"{self.name}\n"

    def export(self):
        return self.to_string()
