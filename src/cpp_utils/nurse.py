from src.cpp_utils.jsonify import Jsonify
from pykson import StringField, ListField


class Nurse(Jsonify):
    name = StringField(serialized_name="name")
    contracts = ListField(str, serialized_name="contracts")
    id = StringField(serialized_name="id_nurse")

    def to_json(self):
        return {
            "id_nurse": self.id,
            "name": self.name,
            "contracts": self.contracts
        }
