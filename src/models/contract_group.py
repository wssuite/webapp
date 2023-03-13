from pykson import StringField, ListField
from src.models.db_document import DBDocument
from src.models.jsonify import Jsonify
from constants import (
    contract_group_name,
    contract_group_contracts_list,
    profile,
)


class ContractGroup(DBDocument, Jsonify):
    name = StringField(serialized_name=contract_group_name)
    contracts = ListField(str, serialized_name=contract_group_contracts_list)
    profile = StringField(serialized_name=profile)

    def db_json(self) -> dict:
        return self.to_json()
