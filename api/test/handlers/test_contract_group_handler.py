from src.exceptions.project_base_exception import ProjectBaseException
from src.dao.abstract_dao import connect_to_fake_db
from src.handlers.contract_group_handler import ContractGroupHandler
from src.exceptions.contract_exceptions import (
    ContractGroupNotExist,
    ContractNotExist,
    ContractContradictionException,
    ContractGroupDeletionError,
)
from src.models.contract import Contract
from unittest import TestCase
from test_constants import (
    default_user,
    contract_group_without_contradiction,
    contract_group_with_contradiction,
    user_token,
    random_hex,
    general_contract_dict,
    full_time_not_valid_contract_with_general,
    test_profile,
    min_cons_contract,
    profile1,
    contract_group_contracts_list,
    nurse_group_with_contract_groups,
    nurse_with_contract_group,
    contract_group_name,
)


class TestContractGroupHandler(TestCase):
    def setUp(self) -> None:
        self.handler = ContractGroupHandler(connect_to_fake_db())
        user = default_user.copy()
        user[user_token] = random_hex
        self.handler.user_dao.insert_one(user)
        self.handler.profile_dao.insert_if_not_exist(test_profile.copy())
        general_contract = Contract().from_json(general_contract_dict.copy())
        self.handler.contract_dao.insert_one(general_contract.db_json())
        full_time_contract = Contract().from_json(
            full_time_not_valid_contract_with_general.copy()
        )
        self.handler.contract_dao.insert_one(full_time_contract.db_json())

    def test_add_contract_group_when_contract_not_exist_raise_exception(self):
        with self.assertRaises(ContractNotExist):
            self.handler.add(random_hex, contract_group_without_contradiction)

    def test_add_contract_group_with_contradicted_contracts_raise_error(self):
        with self.assertRaises(ContractContradictionException):
            self.handler.add(random_hex, contract_group_with_contradiction)

    def insert_deps(self):
        contract = Contract().from_json(min_cons_contract.copy())
        self.handler.contract_dao.insert_one(contract.db_json())

    def test_add_contract_group_with_no_contradiction_succeed(self):
        self.insert_deps()
        self.handler.add(random_hex, contract_group_without_contradiction)
        actual = self.handler.get_all_names(random_hex, profile1)
        self.assertEqual(["contract_group_without_contradiction"], actual)

    def test_add_contract_group_with_unsupported_name_raise_error(self):
        self.insert_deps()
        contract_group = contract_group_without_contradiction.copy()
        contract_group[contract_group_name] = "@contract_group!"
        with self.assertRaises(ProjectBaseException):
            self.handler.add(random_hex, contract_group)

    def test_update_contract_group(self):
        self.insert_deps()
        self.handler.add(random_hex, contract_group_without_contradiction)
        before = self.handler.get_by_name(
            random_hex, "contract_group_without_contradiction", profile1
        )
        update = contract_group_without_contradiction.copy()
        update[contract_group_contracts_list] = []
        self.handler.update(random_hex, update)
        after = self.handler.get_by_name(
            random_hex, "contract_group_without_contradiction", profile1
        )
        self.assertNotEqual(before, after)
        self.assertEqual(update, after)

    def test_delete_contract_group_with_no_deps_succeed(self):
        self.insert_deps()
        self.handler.add(random_hex, contract_group_without_contradiction)
        before = self.handler.get_by_name(
            random_hex, "contract_group_without_contradiction", profile1
        )
        self.handler.delete(
            random_hex, "contract_group_without_contradiction", profile1
        )
        self.assertNotEqual(None, before)
        with self.assertRaises(ContractGroupNotExist):
            self.handler.get_by_name(
                random_hex, "contract_group_without_contradiction", profile1
            )

    def test_delete_contract_group_when_used_raise_error(self):
        self.handler.nurse_dao.insert_one(nurse_with_contract_group.copy())
        self.handler.nurse_group_dao.insert_one_if_not_exist(
            nurse_group_with_contract_groups.copy()
        )
        self.handler.contract_group_dao.insert_if_not_exist(
            contract_group_without_contradiction.copy()
        )
        with self.assertRaises(ContractGroupDeletionError):
            self.handler.delete(
                random_hex,
                contract_group_without_contradiction[contract_group_name],
                profile1,
            )
