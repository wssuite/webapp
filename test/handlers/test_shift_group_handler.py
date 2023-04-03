from src.exceptions.project_base_exception import ProjectBaseException
from src.dao.abstract_dao import connect_to_fake_db
from src.handlers.shift_group_handler import ShiftGroupHandler
from test_constants import (
    work_shift_group,
    night_shift_group,
    full_time_contract_with_day_shift_type,
    day_shift_group,
    random_hex,
    default_user,
    early_shift,
    profile1,
    test_profile,
)
from unittest import TestCase
from constants import user_token, shift_group_shifts_list
from src.exceptions.shift_exceptions import (
    CannotDeleteShiftGroup,
    CannotDeleteDefaultShiftGroup,
    ShiftNotExist,
)
from src.models.contract import Contract


class TestShiftGroupHandler(TestCase):
    def setUp(self) -> None:
        user = default_user.copy()
        user[user_token] = random_hex
        self.handler = ShiftGroupHandler(connect_to_fake_db())
        self.handler.user_dao.insert_one(user)
        self.handler.shift_group_dao.insert_one_if_not_exist(
            work_shift_group.copy()
        )
        contract = Contract().from_json(full_time_contract_with_day_shift_type)
        self.handler.contract_dao.insert_one(contract.db_json())
        self.handler.profile_dao.insert_if_not_exist(test_profile.copy())

    def tearDown(self) -> None:
        pass

    def test_insert_shift_group_with_nonexistent_shifts_raise_error(self):
        with self.assertRaises(ShiftNotExist):
            self.handler.add(random_hex, day_shift_group.copy())

    def test_insert_shift_group_if_shifts_exist_succeed(self):
        shift_groups_before = self.handler.get_all_names(random_hex, profile1)
        expected_before = ["Work"]
        self.handler.shift_dao.insert_one_if_not_exist(early_shift.copy())
        self.handler.add(random_hex, day_shift_group.copy())
        shift_groups_after = self.handler.get_all_names(random_hex, profile1)
        expected_after = ["Work", "Day"]
        self.assertEqual(expected_before, shift_groups_before)
        self.assertEqual(expected_after, shift_groups_after)

    def test_update_shift_group_with_nonexistent_shifts_raise_error(self):
        self.handler.shift_dao.insert_one_if_not_exist(early_shift.copy())
        self.handler.add(random_hex, day_shift_group.copy())
        shift_group_before = self.handler.get_by_name(
            random_hex, "Day", profile1
        )
        update = shift_group_before.copy()
        update[shift_group_shifts_list] = ["MidDay"]
        with self.assertRaises(ShiftNotExist):
            self.handler.update(random_hex, update)
        shift_group_after = self.handler.get_by_name(
            random_hex, "Day", profile1
        )
        self.assertEqual(shift_group_before, shift_group_after)

    def test_update_work_shift_group_raise_error(self):
        with self.assertRaises(ProjectBaseException):
            self.handler.update(random_hex, work_shift_group)

    def test_update_shift_group_with_empty_shifts_succeed(self):
        self.handler.shift_dao.insert_one_if_not_exist(early_shift.copy())
        self.handler.add(random_hex, day_shift_group.copy())
        shift_group_before = self.handler.get_by_name(
            random_hex, "Day", profile1
        )
        update = shift_group_before.copy()
        update[shift_group_shifts_list] = []
        self.handler.update(random_hex, update)
        shift_group_after = self.handler.get_by_name(
            random_hex, "Day", profile1
        )
        self.assertNotEqual(shift_group_before, shift_group_after)

    def test_delete_default_shift_group_raise_error(self):
        with self.assertRaises(CannotDeleteDefaultShiftGroup):
            self.handler.delete(random_hex, "Work", profile1)

    def test_delete_used_shift_group_raise_error(self):
        self.handler.shift_dao.insert_one_if_not_exist(early_shift.copy())
        self.handler.add(random_hex, day_shift_group.copy())
        with self.assertRaises(CannotDeleteShiftGroup):
            self.handler.delete(random_hex, "Day", profile1)

    def test_delete_unused_shift_group_succeed(self):
        self.handler.add(random_hex, night_shift_group)
        expected_before = ["Work", "Night"]
        actual_before = self.handler.get_all_names(random_hex, profile1)
        self.handler.delete(random_hex, "Night", profile1)
        expected_after = ["Work"]
        actual_after = self.handler.get_all_names(random_hex, profile1)
        self.assertEqual(expected_before, actual_before)
        self.assertEqual(expected_after, actual_after)

    def test_get_nonexistent_shift_group_by_name_raise_error(self):
        with self.assertRaises(ShiftNotExist):
            self.handler.get_by_name(random_hex, "Day", profile1)
