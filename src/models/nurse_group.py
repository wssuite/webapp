from src.models.db_document import DBDocument
from src.models.jsonify import Jsonify
from pykson import ListField, StringField
from constants import (
    nurse_group_name,
    nurse_group_nurses_list,
    nurse_group_contracts_list,
    profile,
    nurse_group_contract_groups,
)
from src.models.stringify import (
    Stringify,
    extract_string_from_simple_object_array,
)


class NurseGroup(Jsonify, DBDocument, Stringify):
    name = StringField(serialized_name=nurse_group_name)
    nurses = ListField(str, serialized_name=nurse_group_nurses_list)
    contracts = ListField(str, serialized_name=nurse_group_contracts_list)
    profile = StringField(serialized_name=profile, default_value="")
    contract_groups = ListField(
        str, serialized_name=nurse_group_contract_groups
    )

    def db_json(self):
        return self.to_json()

    def to_string(self):
        nurses_string = extract_string_from_simple_object_array(self.nurses)
        contracts_string = extract_string_from_simple_object_array(
            self.contracts
        )
        contract_groups_string = extract_string_from_simple_object_array(
            self.contract_groups
        )
        return (
            f"{self.name},{len(self.nurses)}{nurses_string},"
            f"{len(self.contracts)}{contracts_string},"
            f"{len(self.contract_groups)}{contract_groups_string}\n"
        )
