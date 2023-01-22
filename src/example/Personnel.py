from pykson import StringField
from src.example.Writable import Writable


class Personnel(Writable):
    name = StringField(serialized_name="name")
    contract_type = StringField(serialized_name="contract_type")

    def __repr__(self):
        return f"{self.name} {self.contract_type}"

    def from_json(self, data: dict):
        return super(Personnel, self).from_json(data)
