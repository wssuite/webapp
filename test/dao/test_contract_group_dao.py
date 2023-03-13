from src.models.contract_group import ContractGroup
from test_constants import (
    contract_group_without_contradiction,
    profile1,
    profile2,
)
from constants import contract_group_name, contract_group_contracts_list
from unittest import TestCase
from src.dao.contract_group_dao import ContractGroupDao
from src.dao.abstract_dao import connect_to_fake_db
from src.exceptions.contract_exceptions import ContractGroupAlreadyExist


class TestContractGroupDao(TestCase):
    def setUp(self) -> None:
        self.dao = ContractGroupDao(connect_to_fake_db())

    def tearDown(self) -> None:
        pass

    def test_insert_contract_group_if_not_exist_succeed(self):
        contract_group = ContractGroup().from_json(
            contract_group_without_contradiction
        )
        self.dao.insert_if_not_exist(contract_group.db_json().copy())
        actual = self.dao.fetch_all(profile1)
        self.assertEqual(1, len(actual))
        self.assertEqual(contract_group_without_contradiction, actual[0])

    def test_insert_contract_group_if_exist_raise_error(self):
        contract_group = ContractGroup().from_json(
            contract_group_without_contradiction
        )
        self.dao.insert_if_not_exist(contract_group.db_json().copy())
        with self.assertRaises(ContractGroupAlreadyExist):
            self.dao.insert_if_not_exist(contract_group.db_json().copy())

    def test_get_including_contract(self):
        contract_group = ContractGroup().from_json(
            contract_group_without_contradiction
        )
        self.dao.insert_if_not_exist(contract_group.db_json().copy())
        min_cons_contract_groups = self.dao.get_including_contracts(
            ["minConsContract"], profile1
        )
        general_contract_groups = self.dao.get_including_contracts(
            ["General"], profile1
        )
        self.assertEqual(0, len(general_contract_groups))
        self.assertEqual(1, len(min_cons_contract_groups))
        self.assertEqual(
            contract_group_without_contradiction, min_cons_contract_groups[0]
        )

    def test_duplicate_contract_groups(self):
        contract_group = ContractGroup().from_json(
            contract_group_without_contradiction
        )
        self.dao.insert_if_not_exist(contract_group.db_json().copy())
        self.dao.duplicate(profile1, profile2)
        self.dao.delete_all(profile1)
        profile1_groups = self.dao.fetch_all(profile1)
        profile2_groups = self.dao.fetch_all(profile2)
        self.assertEqual(0, len(profile1_groups))
        self.assertEqual(1, len(profile2_groups))

    def test_remove_contract_group(self):
        contract_group = ContractGroup().from_json(
            contract_group_without_contradiction
        )
        self.dao.insert_if_not_exist(contract_group.db_json().copy())
        actual_before = self.dao.fetch_all(profile1)
        self.dao.remove(
            contract_group_without_contradiction[contract_group_name], profile1
        )
        actual_after = self.dao.fetch_all(profile1)
        self.assertEqual(0, len(actual_after))
        self.assertEqual(1, len(actual_before))

    def test_update_contract_group(self):
        contract_group = ContractGroup().from_json(
            contract_group_without_contradiction
        )
        self.dao.insert_if_not_exist(contract_group.db_json().copy())
        update = contract_group_without_contradiction.copy()
        update[contract_group_contracts_list] = []
        self.dao.update(update)
        actual = self.dao.find_by_name(
            contract_group_without_contradiction[contract_group_name], profile1
        )
        self.assertEqual(update, actual)
