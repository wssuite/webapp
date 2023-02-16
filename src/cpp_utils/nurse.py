from src.cpp_utils.jsonify import Jsonify
from pykson import StringField, ListField
from constants import nurse_name, nurse_id, nurse_contracts,\
    nurse_username


class Nurse(Jsonify):
    name = StringField(serialized_name=nurse_name)
    contracts = ListField(str, serialized_name=nurse_contracts)
    id = StringField(serialized_name=nurse_id)
    username = StringField(serialized_name=nurse_username)

    def to_json(self):
        return {
            nurse_id: self.id,
            nurse_name: self.name,
            nurse_contracts: self.contracts,
            nurse_username:self.username
        }
