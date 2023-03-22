from pykson import StringField, ListField

from src.models.exporter import CSVExporter
from src.models.db_document import DBDocument
from src.models.jsonify import Jsonify
from constants import (
    contract_group_name,
    contract_group_contracts_list,
    profile,
)
from src.models.string_reader import StringReader
from src.utils.import_util import sanitize_array, Wrapper


from src.models.stringify import (
    Stringify,
    extract_string_from_simple_object_array,
)


class ContractGroup(DBDocument, Jsonify, StringReader, Stringify, CSVExporter):
    name = StringField(serialized_name=contract_group_name)
    contracts = ListField(str, serialized_name=contract_group_contracts_list)
    profile = StringField(serialized_name=profile)

    def db_json(self) -> dict:
        return self.to_json()

    def read_contract_group(self, line, profile_name):
        self.profile = profile_name
        return self.read_line(line)

    def read_line(self, line):
        tokens = line.split(",")
        tokens = sanitize_array(tokens)
        wrapper = Wrapper(tokens)
        self.name = wrapper.get_by_index(0)
        for i in range(1, len(tokens)):
            self.contracts.append(wrapper.get_by_index(i))

        return self

    def to_string(self):
        contracts_string = extract_string_from_simple_object_array(
            self.contracts
        )
        return f"{self.name},{len(self.contracts)}{contracts_string}\n"

    def export(self):
        contracts_string = extract_string_from_simple_object_array(
            self.contracts
        )
        return f"{self.name}{contracts_string}\n"
