from test_constants import (
    general_contract_dict,
    day_shift_type,
    early_shift,
    late_shift,
    random_hex,
    default_user,
)
from src.dao.abstract_dao import connect_to_fake_db
from unittest import TestCase
from src.handlers.shift_handler import ShiftHandler
from constants import user_token, shift_start_time
from src.exceptions.shift_exceptions import CannotDeleteShift, ShiftNotExist


class TestShiftHandler(TestCase):
    def setUp(self) -> None:
        self.handler = ShiftHandler(connect_to_fake_db())
        user = default_user.copy()
        user[user_token] = random_hex
        self.handler.user_dao.insert_one(user.copy())
        self.handler.contract_dao.insert_one(general_contract_dict.copy())
        self.handler.shift_dao.insert_one_if_not_exist(early_shift.copy())
        self.handler.shift_type_dao.insert_one_if_not_exist(
            day_shift_type.copy()
        )

    def tearDown(self) -> None:
        pass

    def test_add_new_skill(self):
        actual_before = self.handler.get_all_names(random_hex)
        expected_before = ["Early"]
        self.handler.add(random_hex, late_shift)
        actual_after = self.handler.get_all_names(random_hex)
        expected_after = ["Early", "Late"]
        self.assertEqual(expected_before, actual_before)
        self.assertEqual(expected_after, actual_after)

    def test_update_skill(self):
        actual_before = self.handler.get_by_name(random_hex, "Early")
        update_early_shift = early_shift.copy()
        update_early_shift[shift_start_time] = "09:00:00"
        self.handler.update(random_hex, update_early_shift.copy())
        actual_after = self.handler.get_by_name(random_hex, "Early")
        self.assertEqual(early_shift, actual_before)
        self.assertEqual(update_early_shift, actual_after)

    def test_delete_skill(self):
        self.handler.shift_dao.insert_one_if_not_exist(late_shift.copy())
        with self.assertRaises(CannotDeleteShift):
            self.handler.delete(random_hex, "Early")
        self.handler.delete(random_hex, "Late")
        actual = self.handler.get_all(random_hex)
        expected = [early_shift]
        self.assertEqual(expected, actual)

    def test_get_shift_by_name_if_not_exist_raise_error(self):
        with self.assertRaises(ShiftNotExist):
            self.handler.get_by_name(random_hex, "MidDay")
