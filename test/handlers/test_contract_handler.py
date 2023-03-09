from src.dao.abstract_dao import connect_to_fake_db
from src.handlers.contract_handler import ContractHandler
from test_constants import (
    default_user,
    general_contract_dict,
    full_time_valid_contract_with_general,
    full_time_not_valid_contract_with_general,
    full_time_valid_contract_with_general_update_to_invalid,
    early_shift,
    late_shift,
    nurse1,
    nurse_group1,
    random_hex,
    nurse_group2,
    min_cons_contract, profile1
)
from unittest import TestCase
from constants import user_token, contract_name, profile
from src.exceptions.shift_exceptions import ShiftNotExist
from src.exceptions.contract_exceptions import (
    CannotDeleteContract,
    ContractNotExist,
)


class TestContractHandler(TestCase):
    def setUp(self) -> None:
        self.handler = ContractHandler(connect_to_fake_db())
        user = default_user.copy()
        user[user_token] = random_hex
        self.handler.user_dao.insert_one(user)
        self.handler.contract_dao.insert_one(general_contract_dict.copy())
        self.handler.shift_dao.insert_one_if_not_exist(late_shift.copy())
        self.handler.nurse_dao.insert_one(nurse1.copy())
        self.handler.nurse_group_dao.insert_one_if_not_exist(
            nurse_group1.copy()
        )
        self.handler.nurse_group_dao.insert_one_if_not_exist(
            nurse_group2.copy()
        )
        self.handler.contract_dao.insert_one(
            full_time_not_valid_contract_with_general.copy()
        )
        self.handler.contract_dao.insert_one(min_cons_contract.copy())

    def insert_missing_deps(self):
        self.handler.shift_dao.insert_one_if_not_exist(early_shift.copy())
        self.handler.add(
            random_hex, full_time_valid_contract_with_general.copy()
        )

    def test_contract_addition_if_shift_not_exist_raise_error(self):
        with self.assertRaises(ShiftNotExist):
            self.handler.add(
                random_hex,
                full_time_valid_contract_with_general_update_to_invalid,
            )

    def test_contract_addition(self):
        self.insert_missing_deps()
        all_contracts = self.handler.get_all(random_hex, profile1)
        self.assertEqual(4, len(all_contracts))
        self.assertEqual(
            [
                general_contract_dict,
                full_time_not_valid_contract_with_general,
                min_cons_contract,
                full_time_valid_contract_with_general,
            ],
            all_contracts,
        )

    def test_update_contract_if_update_not_contradict_depended_succeed(self):
        self.insert_missing_deps()
        self.handler.update(random_hex, full_time_valid_contract_with_general)
        contract = self.handler.contract_dao.find_by_name(
            full_time_valid_contract_with_general[contract_name],
            full_time_valid_contract_with_general[profile]
        )
        self.assertEqual(full_time_valid_contract_with_general, contract)

    def test_delete_contract_if_contract_has_depended_object_raise_error(self):
        self.insert_missing_deps()
        with self.assertRaises(CannotDeleteContract):
            self.handler.delete(
                random_hex,
                full_time_valid_contract_with_general[contract_name], profile1
            )

    def test_delete_contract_if_contract_not_have_depended_object_succeeds(
        self,
    ):
        self.insert_missing_deps()
        self.handler.delete(
            random_hex,
            full_time_not_valid_contract_with_general[contract_name], profile1
        )
        contracts = self.handler.contract_dao.fetch_all(profile1)
        self.assertEqual(3, len(contracts))

    def test_get_contract_by_name_if_exist_return_contract(self):
        self.insert_missing_deps()
        contract = self.handler.get_by_name(
            random_hex, full_time_valid_contract_with_general[contract_name], profile1
        )
        self.assertEqual(full_time_valid_contract_with_general, contract)

    def test_get_contract_by_name_if_not_exist_raise_error(self):
        with self.assertRaises(ContractNotExist):
            self.handler.get_by_name(
                random_hex,
                full_time_valid_contract_with_general[contract_name], profile1
            )

    def test_get_all_contract_names(self):
        self.insert_missing_deps()
        expected = [
            general_contract_dict[contract_name],
            full_time_not_valid_contract_with_general[contract_name],
            min_cons_contract[contract_name],
            full_time_valid_contract_with_general[contract_name],
        ]
        names = self.handler.get_all_names(random_hex, profile1)
        self.assertEqual(expected, names)
