from src.models.jsonify import Jsonify
from src.models.db_document import DBDocument
from pykson import StringField
from constants import skill_name


class Skill(Jsonify, DBDocument):
    name = StringField(serialized_name=skill_name)

    def db_json(self) -> dict:
        return self.to_json()
