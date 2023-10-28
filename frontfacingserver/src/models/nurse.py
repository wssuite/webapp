from src.models.exporter import CSVExporter
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


class Nurse(Jsonify, DBDocument, Stringify, StringReader, CSVExporter):
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
        contract_names = self.read_line(line)
        for c in contract_names:
            if c in contract_groups:
                self.contract_groups.append(c)
            else:
                self.direct_contracts.append(c)

        return self

    def read_line(self, line):
        tokens = line.split(",")
        tokens = sanitize_array(tokens)
        wrapper = Wrapper(tokens)
        self.username = wrapper.get_by_index(1)
        self.name = wrapper.get_by_index(0)
        contract_names = []
        for i in range(2, len(tokens)):
            c = wrapper.get_by_index(i)
            if not c.isdigit():
                contract_names.append(c)
        return contract_names

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

    def export(self):
        contracts_string = extract_string_from_simple_object_array(
            self.direct_contracts
        )
        contract_groups_string = extract_string_from_simple_object_array(
            self.contract_groups
        )
        return (
            f"{self.name},{self.username}{contracts_string}"
            f"{contract_groups_string}\n"
        )
