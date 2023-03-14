from pykson import StringField, ListField
from src.models.db_document import DBDocument
from src.models.jsonify import Jsonify
from constants import (
    contract_group_name,
    contract_group_contracts_list,
    profile,
)
from src.models.stringify import Stringify


class ContractGroup(DBDocument, Jsonify, Stringify):
    name = StringField(serialized_name=contract_group_name)
    contracts = ListField(str, serialized_name=contract_group_contracts_list)
    profile = StringField(serialized_name=profile)

    def db_json(self) -> dict:
        return self.to_json()

    def to_string(self):
        contracts_string = ""
        for contract in self.contracts:
            contracts_string += f",{contract}"
        return f"{self.name},{len(self.contracts)}{contracts_string}"
