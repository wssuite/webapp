from src.models.jsonify import Jsonify
from pykson import StringField, ListField
from constants import nurse_name, nurse_id, nurse_contracts, nurse_username

from models.db_document import DBDocument


class Nurse(Jsonify, DBDocument):
    name = StringField(serialized_name=nurse_name)
    contracts = ListField(str, serialized_name=nurse_contracts)
    id = StringField(serialized_name=nurse_id)
    username = StringField(serialized_name=nurse_username)

    def db_json(self):
        return self.to_json()
