from unittest import TestCase
from src.exceptions.shift_exceptions import (
    ShiftGroupAlreadyExistException
)
from constants import (shift_group_name,
                       shift_group_shifts_list)
from src.dao.abstract_dao import connect_to_fake_db
from src.dao.shift_group_dao import ShiftGroupDao


class TestShiftGroupDao(TestCase):
    def setUp(self) -> None:
        self.dao = ShiftGroupDao(connect_to_fake_db())
        self.shift_group = {
            shift_group_name: "Work",
            shift_group_shifts_list: [
                "Early", "Day", "Midnight"
            ]
        }
        self.shift_group_update = {
            shift_group_name: "Work",
            shift_group_shifts_list: [
                "Early", "Day",
                "Midnight", "Night"
            ]
        }

    def tearDown(self) -> None:
        pass

    def test_insert_shift_group_when_not_exist_succeeds(self):
        self.dao.insert_one_if_not_exist(self.shift_group.copy())
        shifts = self.dao.fetch_all()
        self.assertEqual(1, len(shifts))
        self.assertEqual(self.shift_group, shifts[0])

    def test_insert_shift_group_when_exist_raises_exception(self):
        self.dao.insert_one_if_not_exist(self.shift_group.copy())
        with self.assertRaises(ShiftGroupAlreadyExistException):
            self.dao.insert_one_if_not_exist(self.shift_group_update.copy())

    def test_remove_shift_group(self):
        self.dao.insert_one_if_not_exist(self.shift_group.copy())
        shift_groups_before = self.dao.fetch_all()
        self.dao.remove(self.shift_group[shift_group_name])
        shift_groups_after = self.dao.fetch_all()
        self.assertEqual(1, len(shift_groups_before))
        self.assertEqual(0, len(shift_groups_after))

    def test_update_shift_group(self):
        self.dao.insert_one_if_not_exist(self.shift_group.copy())
        self.dao.update(self.shift_group_update.copy())
        shift_group = self.dao.find_by_name(
            self.shift_group[shift_group_name]
        )
        self.assertEqual(self.shift_group_update, shift_group)

    def test_get_shift_groups_including_shifts(self):
        self.dao.insert_one_if_not_exist(self.shift_group.copy())
        night_shift_group = self.dao.get_including_shifts(
            ["Night"]
        )
        day_shift_group = self.dao.get_including_shifts(
            ["Day"]
        )
        self.assertEqual(0, len(night_shift_group))
        self.assertEqual(1, len(day_shift_group))
        self.assertEqual(self.shift_group, day_shift_group[0])
