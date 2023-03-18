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
from src.models.string_reader import StringReader
from src.utils.import_util import sanitize_array, Wrapper


class Nurse(Jsonify, DBDocument, Stringify, StringReader):
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

        self.direct_contracts = [
            c for c in self.direct_contracts if c not in contract_groups
        ]
        return self

    def read_line(self, line):
        tokens = line.split(",")
        tokens = sanitize_array(tokens)
        wrapper = Wrapper(tokens)
        self.username = wrapper.get_by_index(0)
        self.name = wrapper.get_by_index(1)
        self.direct_contracts = []
        for i in range(2, len(tokens)):
            self.direct_contracts.append(wrapper.get_by_index(i))

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
