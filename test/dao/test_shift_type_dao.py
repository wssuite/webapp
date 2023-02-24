from src.dao.shift_type_dao import ShiftTypeDao
from unittest import TestCase
from src.dao.abstract_dao import connect_to_fake_db
from constants import (shift_type_name,
                       shift_type_shifts_lists)
from src.exceptions.shift_exceptions import (
    ShiftTypeAlreadyExistException
)


class TestShiftTypeDao(TestCase):
    def setUp(self) -> None:
        self.dao = ShiftTypeDao(connect_to_fake_db())
        self.shift_type = {
            shift_type_name: "Day",
            shift_type_shifts_lists: ["Early",
                                      "MidDay"]
        }
        self.shift_type_update = {
            shift_type_name: "Day",
            shift_type_shifts_lists: ["Early",
                                      "Morning",
                                      "Afternoon",
                                      "MidDay"]
        }

    def test_insert_shift_type_when_not_exist_succeed(self):
        self.dao.insert_one_if_not_exist(self.shift_type.copy())
        all_shift_types = self.dao.fetch_all_shift_types()
        self.assertEqual(1, len(all_shift_types))
        self.assertEqual(self.shift_type, all_shift_types[0])

    def test_insert_shift_type_when_exist_raises_exception(self):
        self.dao.insert_one_if_not_exist(self.shift_type.copy())
        with self.assertRaises(ShiftTypeAlreadyExistException):
            self.dao.insert_one_if_not_exist(
                self.shift_type_update
            )

    def test_remove_shift_type(self):
        self.dao.insert_one_if_not_exist(self.shift_type.copy())
        shift_type_len_before = len(self.dao.fetch_all_shift_types())
        self.dao.remove_shift_type(self.shift_type[shift_type_name])
        shift_type_len_after = len(self.dao.fetch_all_shift_types())
        self.assertEqual(1, shift_type_len_before)
        self.assertEqual(0, shift_type_len_after)

    def test_update_shift_type(self):
        self.dao.insert_one_if_not_exist(self.shift_type.copy())
        self.dao.update_shift_type(self.shift_type_update)
        shift_type_updated = self.dao.find_shift_type_by_name(
            self.shift_type[shift_type_name]
        )
        self.assertEqual(self.shift_type_update,
                         shift_type_updated
                         )

    def test_get_shift_types_including_shifts(self):
        self.dao.insert_one_if_not_exist(self.shift_type.copy())
        night_shift_types = (self.dao.
                             get_shift_types_including_shifts
                             (["Night"])
                             )
        self.assertEqual(0, len(night_shift_types))
        early_shift_types = (self.dao.
                             get_shift_types_including_shifts
                             (["Early"])
                             )
        self.assertEqual(1, len(early_shift_types))
        self.assertEqual(self.shift_type,
                         early_shift_types[0])
