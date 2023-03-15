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

from src.models.db_document import DBDocument
from src.models.string_reader import StringReader
from src.utils.import_util import sanitize_array


class Nurse(Jsonify, DBDocument, StringReader):
    name = StringField(serialized_name=nurse_name, default_value=admin)
    direct_contracts = ListField(str, serialized_name=nurse_contracts)
    id = StringField(serialized_name=nurse_id)
    username = StringField(serialized_name=nurse_username, default_value=admin)
    profile = StringField(serialized_name=profile, default_value="")
    contract_groups = ListField(str, serialized_name=nurse_contract_groups)

    def db_json(self):
        return self.to_json()

    def read_nurse(self, line, profile_name, contract_groups):
        self.profile = profile_name
        self.read_line(line)
        for c in self.direct_contracts:
            if c in contract_groups:
                self.contract_groups.append(c)

        self.direct_contracts = [c for c in self.direct_contracts if c not in contract_groups]
        return self.to_json()

    def read_line(self, line):
        tokens = line.split(',')
        tokens = sanitize_array(tokens)
        self.username = tokens[0]
        self.name = tokens[1]
        self.direct_contracts = []
        for i in range(2, len(tokens)):
            self.direct_contracts.append(tokens[i])

        return self.to_json()
