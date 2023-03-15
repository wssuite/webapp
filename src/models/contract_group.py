from pykson import StringField, ListField
from src.models.db_document import DBDocument
from src.models.jsonify import Jsonify
from constants import (
    contract_group_name,
    contract_group_contracts_list,
    profile,
)
from src.models.string_reader import StringReader


class ContractGroup(DBDocument, Jsonify, StringReader):
    name = StringField(serialized_name=contract_group_name)
    contracts = ListField(str, serialized_name=contract_group_contracts_list)
    profile = StringField(serialized_name=profile)

    def db_json(self) -> dict:
        return self.to_json()

    def read_contract_group(self, line, profile_name):
        self.profile = profile_name
        return self.read_line(line)

    def read_line(self, line):
        tokens = line.split(',')
        self.name = tokens[0]
        for i in range(1, len(tokens)):
            if tokens[i] != '':
                self.contracts.append(tokens[i])

        return self.to_json()