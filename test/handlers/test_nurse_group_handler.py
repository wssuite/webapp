from src.handlers.nurse_group_handler import NurseGroupHandler
from test_constants import (
    general_contract_dict,
    problematic_nurse_group,
    patrick_nurse,
    patrick_nurse_group,
    default_user,
    random_hex,
    full_time_contract_with_day_shift_type,
    not_problematic_group,
)
from src.exceptions.contract_exceptions import (
    ContractNotExist,
)
from src.exceptions.nurse_exceptions import NurseNotFound, NurseGroupNotFound
from unittest import TestCase
from constants import user_token
from src.dao.abstract_dao import connect_to_fake_db
from constants import nurse_group_contracts_list


class TestNurseGroupHandler(TestCase):
    def setUp(self) -> None:
        user = default_user.copy()
        user[user_token] = random_hex
        self.handler = NurseGroupHandler(connect_to_fake_db())
        self.handler.user_dao.insert_one(user.copy())
        self.handler.contract_dao.insert_one(general_contract_dict.copy())
        self.handler.contract_dao.insert_one(
            full_time_contract_with_day_shift_type.copy()
        )

    def tearDown(self) -> None:
        pass

    def test_add_nurse_group_when_nurse_not_exist_raise_error(self):
        with self.assertRaises(NurseNotFound):
            self.handler.add(random_hex, patrick_nurse_group)

    def test_add_nurse_group_when_contract_not_exist_raise_error(self):
        self.handler.nurse_dao.insert_one(patrick_nurse.copy())
        with self.assertRaises(ContractNotExist):
            self.handler.add(random_hex, problematic_nurse_group.copy())

    def test_add_nurse_group_with_no_contradiction_succeed(self):
        self.handler.nurse_dao.insert_one(patrick_nurse.copy())
        self.handler.add(random_hex, patrick_nurse_group.copy())
        self.handler.add(random_hex, not_problematic_group.copy())
        actual = self.handler.get_all_names(random_hex)
        expected = ["patrick's group", "not problematic_group"]
        self.assertEqual(expected, actual)

    def test_update_nurse_group_without_contradiction_succeed(self):
        self.handler.nurse_dao.insert_one(patrick_nurse.copy())
        self.handler.add(random_hex, patrick_nurse_group.copy())
        self.handler.add(random_hex, not_problematic_group.copy())
        update = patrick_nurse_group.copy()
        update[nurse_group_contracts_list] = []
        self.handler.update(random_hex, update)
        actual = self.handler.get_by_name(random_hex, "patrick's group")
        self.assertEqual(update, actual)

    def test_delete_nurse_group_succeed(self):
        self.handler.nurse_dao.insert_one(patrick_nurse.copy())
        self.handler.add(random_hex, patrick_nurse_group.copy())
        before = self.handler.get_by_name(random_hex, "patrick's group")
        self.handler.delete(random_hex, "patrick's group")
        self.assertEqual(patrick_nurse_group, before)
        with self.assertRaises(NurseGroupNotFound):
            self.handler.get_by_name(random_hex, "patrick's group")
