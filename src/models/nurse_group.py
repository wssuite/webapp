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
from src.models.string_reader import StringReader
from src.utils.import_util import sanitize_array, Wrapper


from src.models.stringify import (
    Stringify,
    extract_string_from_simple_object_array,
)


class NurseGroup(Jsonify, DBDocument, Stringify, StringReader):
    name = StringField(serialized_name=nurse_group_name)
    nurses = ListField(str, serialized_name=nurse_group_nurses_list)
    contracts = ListField(str, serialized_name=nurse_group_contracts_list)
    profile = StringField(serialized_name=profile, default_value="")
    contract_groups = ListField(
        str, serialized_name=nurse_group_contract_groups
    )

    def db_json(self):
        return self.to_json()

    def read_nurse_group(self, line, profile_name, contracts, contract_groups):
        self.profile = profile_name
        self.read_line(line)

        for n in self.nurses:
            if n in contracts:
                self.contracts.append(n)
            elif n in contract_groups:
                self.contract_groups.append(n)

        self.nurses = [
            n
            for n in self.nurses
            if n not in contracts and n not in contract_groups
        ]

        return self

    def read_line(self, line):
        tokens = line.split(",")
        tokens = sanitize_array(tokens)
        wrapper = Wrapper(tokens)
        self.name = wrapper.get_by_index(0)
        for i in range(1, len(tokens)):
            self.nurses.append(wrapper.get_by_index(i))

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
