from src.models.jsonify import Jsonify
from src.models.db_document import DBDocument
from pykson import StringField
from constants import skill_name, profile


class Skill(Jsonify, DBDocument):
    name = StringField(serialized_name=skill_name)
    profile = StringField(serialized_name=profile, default_value="")

    def db_json(self) -> dict:
        return self.to_json()
