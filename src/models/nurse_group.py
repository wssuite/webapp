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


class NurseGroup(Jsonify, DBDocument):
    name = StringField(serialized_name=nurse_group_name)
    nurses = ListField(str, serialized_name=nurse_group_nurses_list)
    contracts = ListField(str, serialized_name=nurse_group_contracts_list)
    profile = StringField(serialized_name=profile, default_value="")
    contract_groups = ListField(
        str, serialized_name=nurse_group_contract_groups
    )

    def db_json(self):
        return self.to_json()
