from unittest import TestCase
from src.dao.abstract_dao import connect_to_fake_db
from src.handlers.nurse_handler import (
    NurseHandler,
    NurseNotFound,
    CannotDeleteNurse,
)
from test_constants import (
    default_user,
    random_hex,
    general_contract_dict,
    patrick_nurse,
    min_cons_contract,
    nurse1,
    full_time_contract_with_day_shift_type,
    patrick_nurse_group,
    full_time_not_valid_contract_with_general,
    profile1,
)
from constants import user_token
from src.exceptions.contract_exceptions import (
    ContractNotExist,
)
from constants import (
    nurse_contracts,
    nurse_id,
)


class TestNurseHandler(TestCase):
    def setUp(self) -> None:
        self.handler = NurseHandler(connect_to_fake_db())
        user = default_user.copy()
        user[user_token] = random_hex
        self.handler.user_dao.insert_one(user.copy())
        self.handler.contract_dao.insert_one(general_contract_dict.copy())
        self.handler.nurse_group_dao.insert_one_if_not_exist(
            patrick_nurse_group.copy()
        )
        self.patrick_id = self.handler.nurse_dao.insert_one(
            patrick_nurse.copy()
        )
        self.handler.contract_dao.insert_one(
            full_time_contract_with_day_shift_type.copy()
        )
        self.handler.contract_dao.insert_one(
            full_time_not_valid_contract_with_general.copy()
        )

    def tearDown(self) -> None:
        pass

    def test_add_nurse_with_nonexistent_contract_raise_error(self):
        with self.assertRaises(ContractNotExist):
            self.handler.add(random_hex, nurse1)

    def test_add_nurse_when_contract_exist_with_contract_contradiction_succeed(
        self,
    ):
        self.handler.contract_dao.insert_one(min_cons_contract)
        self.handler.add(random_hex, nurse1)
        actual = self.handler.get_all_usernames(random_hex, profile1)
        expected = ["patrick", "nurse1"]
        self.assertEqual(expected, actual)

    def test_update_nurse_without_contract_contradiction_succeed(self):
        update = patrick_nurse.copy()
        update[nurse_contracts] = []
        self.handler.update(random_hex, update.copy())
        actual = self.handler.get_by_username(random_hex, "patrick", profile1)
        expected = update.copy()
        expected[nurse_id] = str(self.patrick_id.inserted_id)
        self.assertEqual(expected, actual)

    def test_get_all_nurses(self):
        actual = self.handler.get_all(random_hex, profile1)
        nurse_copy = patrick_nurse.copy()
        nurse_copy[nurse_id] = str(self.patrick_id.inserted_id)
        expected = [nurse_copy]
        self.assertEqual(expected, actual)

    def test_get_nonexistent_nurse_raise_error(self):
        with self.assertRaises(NurseNotFound):
            self.handler.get_by_username(random_hex, "Monique", profile1)

    def test_delete_nurse_exist_in_nurse_group_raise_error(self):
        with self.assertRaises(CannotDeleteNurse):
            self.handler.delete(random_hex, "patrick", profile1)

    def test_delete_nurse_with_no_nurse_groups_raise_error(self):
        self.handler.nurse_dao.insert_one(nurse1)
        actual_before = self.handler.get_all_usernames(random_hex, profile1)
        expected_before = ["patrick", "nurse1"]
        self.handler.delete(random_hex, "nurse1", profile1)
        actual_after = self.handler.get_all_usernames(random_hex, profile1)
        expected_after = ["patrick"]
        self.assertEqual(expected_before, actual_before)
        self.assertEqual(expected_after, actual_after)
