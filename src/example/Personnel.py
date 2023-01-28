from pykson import StringField
from Writable import Writable


class Personnel(Writable):
    name = StringField(serialized_name="name")
    contract_type = StringField(serialized_name="contract_type")

    def __repr__(self):
        return f"{self.name} {self.contract_type}"
