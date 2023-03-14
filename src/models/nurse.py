from src.models.jsonify import Jsonify
from pykson import StringField, ListField
from constants import (
    nurse_name,
    nurse_id,
    nurse_contracts,
    nurse_username,
    admin,
    profile,
    nurse_contract_groups,
)
from src.models.stringify import (
    Stringify,
    extract_string_from_simple_object_array,
)
from src.models.db_document import DBDocument


class Nurse(Jsonify, DBDocument, Stringify):
    name = StringField(serialized_name=nurse_name, default_value=admin)
    direct_contracts = ListField(str, serialized_name=nurse_contracts)
    id = StringField(serialized_name=nurse_id)
    username = StringField(serialized_name=nurse_username, default_value=admin)
    profile = StringField(serialized_name=profile, default_value="")
    contract_groups = ListField(str, serialized_name=nurse_contract_groups)

    def db_json(self):
        return self.to_json()

    def to_string(self):
        contracts_string = extract_string_from_simple_object_array(
            self.direct_contracts
        )
        contract_groups_string = extract_string_from_simple_object_array(
            self.contract_groups
        )
        return (
            f"{self.id},{self.username},{len(self.direct_contracts)}"
            f"{contracts_string},{len(self.contract_groups)}"
            f"{contract_groups_string}\n"
        )
