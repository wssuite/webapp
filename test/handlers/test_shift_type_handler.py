from test_constants import (
    day_shift_type,
    night_shift_type,
    random_hex,
    default_user,
    test_work_shift_group,
    late_shift,
    early_shift,
    full_time_contract_with_day_shift_type,
    profile1, test_profile
)
from src.dao.abstract_dao import connect_to_fake_db
from unittest import TestCase
from src.handlers.shift_type_handler import ShiftTypeHandler
from constants import user_token, shift_type_shifts_lists
from src.exceptions.shift_exceptions import (
    CannotDeleteShiftType,
    ShiftNotExist,
)
from src.models.contract import Contract


class TestShiftHandler(TestCase):
    def setUp(self) -> None:
        contract = Contract().from_json(full_time_contract_with_day_shift_type)
        self.handler = ShiftTypeHandler(connect_to_fake_db())
        user = default_user.copy()
        user[user_token] = random_hex
        self.handler.user_dao.insert_one(user.copy())
        self.handler.shift_type_dao.insert_one_if_not_exist(
            day_shift_type.copy()
        )
        self.handler.contract_dao.insert_one(contract.db_json())
        self.handler.shift_group_dao.insert_one_if_not_exist(
            test_work_shift_group.copy()
        )
        self.handler.shift_dao.insert_one_if_not_exist(early_shift)
        self.handler.profile_dao.insert_if_not_exist(test_profile.copy())

    def tearDown(self) -> None:
        pass

    def test_add_new_shift_type_if_included_shift_dont_exist_raise_error(self):
        actual_before = self.handler.get_all_names(random_hex, profile1)
        expected_before = ["Day"]
        self.assertEqual(expected_before, actual_before)
        with self.assertRaises(ShiftNotExist):
            self.handler.add(random_hex, night_shift_type)
        actual_after = self.handler.get_all_names(random_hex, profile1)
        self.assertEqual(expected_before, actual_after)

    def test_add_new_shift_type_if_included_shift_exist_gets_added(self):
        actual_before = self.handler.get_all_names(random_hex, profile1)
        expected_before = ["Day"]
        self.assertEqual(expected_before, actual_before)
        self.handler.shift_dao.insert_one_if_not_exist(late_shift)
        self.handler.add(random_hex, night_shift_type)
        actual_after = self.handler.get_all_names(random_hex, profile1)
        expected_after = ["Day", "Night"]
        self.assertEqual(expected_after, actual_after)

    def test_update_shift_type_to_include_nonexistent_shift_raise_error(self):
        shift_before = self.handler.get_by_name(random_hex, "Day", profile1)
        update = shift_before.copy()
        update[shift_type_shifts_lists] = ["Early", "MidDay"]
        with self.assertRaises(ShiftNotExist):
            self.handler.update(random_hex, update)
        shift_after = self.handler.get_by_name(random_hex, "Day", profile1)
        self.assertEqual(shift_before, shift_after)

    def test_update_shift_type_to_not_have_any_shifts_succeed(self):
        shift_before = self.handler.get_by_name(random_hex, "Day", profile1)
        update = shift_before.copy()
        update[shift_type_shifts_lists] = []
        self.handler.update(random_hex, update)
        shift_after = self.handler.get_by_name(random_hex, "Day", profile1)
        self.assertNotEqual(shift_before, shift_after)

    def test_get_shift_type_if_not_exist_raise_error(self):
        with self.assertRaises(ShiftNotExist):
            self.handler.get_by_name(random_hex, "MidDay", profile1)

    def test_delete_shift_type_has_dependent_objects_raise_error(self):
        all_shifts_before = self.handler.get_all(random_hex, profile1)
        with self.assertRaises(CannotDeleteShiftType):
            self.handler.delete(random_hex, "Day", profile1)
        all_shifts_after = self.handler.get_all(random_hex, profile1)
        self.assertEqual(all_shifts_before, all_shifts_after)

    def test_delete_shift_type_with_no_dependent_objects_succeed(self):
        self.handler.shift_dao.insert_one_if_not_exist(late_shift)
        self.handler.add(random_hex, night_shift_type.copy())
        all_shift_types_before = self.handler.get_all(random_hex, profile1)
        self.handler.delete(random_hex, "Night", profile1)
        all_shift_types_after = self.handler.get_all(random_hex, profile1)
        self.assertEqual(2, len(all_shift_types_before))
        self.assertEqual(1, len(all_shift_types_after))
