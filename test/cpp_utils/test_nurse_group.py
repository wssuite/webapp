import unittest

from constants import profile, nurse_group_name, nurse_group_nurses_list, nurse_group_contracts_list, \
    nurse_group_contract_groups
from src.models.nurse_group import NurseGroup
from test_constants import profile1


class TestNurseGroup(unittest.TestCase):

    def setUp(self) -> None:
        self.expected_group = {
            profile: profile1,
            nurse_group_name: "group 1",
            nurse_group_nurses_list: ["suz", "Mon"],
            nurse_group_contracts_list: ["contract 1"],
            nurse_group_contract_groups: []
        }

    def tearDown(self) -> None:
        pass

    def test_nurse_group_creation_from_string_parse_structure(self):
        profile_name = profile1
        line = "group 1,contract 1,suz,Mon,,,,,,"
        contracts = ["contract 1"]
        contract_groups = []
        nurse_group = NurseGroup().read_nurse_group(line, profile_name, contracts, contract_groups)
        self.assertEqual(self.expected_group, nurse_group)

