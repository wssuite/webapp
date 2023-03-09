from src.models.jsonify import Jsonify
from src.models.db_document import DBDocument
from pykson import StringField, ListField
from constants import profile_name, profile_creator, profile_access


class Profile(Jsonify, DBDocument):
    name = StringField(serialized_name=profile_name)
    access = ListField(str, serialized_name=profile_access)
    creator = StringField(serialized_name=profile_creator)

    def db_json(self) -> dict:
        return self.to_json()
