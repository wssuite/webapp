from src.models.jsonify import Jsonify
from src.models.db_document import DBDocument
from pykson import StringField, ListField
from constants import profile_name, profile_creator, profile_access
from src.models.string_reader import StringReader


class Profile(Jsonify, DBDocument, StringReader):
    name = StringField(serialized_name=profile_name)
    access = ListField(str, serialized_name=profile_access)
    creator = StringField(serialized_name=profile_creator)

    def db_json(self) -> dict:
        json = self.to_json()
        json[profile_access] = self.access
        return json

    def to_json(self):
        return {
            profile_name: self.name,
            profile_creator: self.creator,
        }

    def read_line(self, line):
        tokens = line.split(',')
        self.name = tokens[1]
        return self.to_json()
