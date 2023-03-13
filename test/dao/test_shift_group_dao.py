from unittest import TestCase
from src.exceptions.shift_exceptions import (
    ShiftGroupAlreadyExistException,
    ShiftNotExist,
)
from constants import shift_group_name, shift_group_shifts_list, profile
from src.dao.abstract_dao import connect_to_fake_db
from src.dao.shift_group_dao import ShiftGroupDao
from test_constants import profile1, profile2, shift_group_shift_types


class TestShiftGroupDao(TestCase):
    def setUp(self) -> None:
        self.dao = ShiftGroupDao(connect_to_fake_db())
        self.shift_group = {
            shift_group_name: "Work",
            shift_group_shifts_list: ["Early", "Midnight"],
            profile: profile1,
            shift_group_shift_types: ["Day"],
        }
        self.shift_group_update = {
            shift_group_name: "Work",
            shift_group_shifts_list: ["Early", "Midnight", "Night"],
            profile: profile1,
            shift_group_shift_types: ["Day"],
        }

    def tearDown(self) -> None:
        pass

    def test_insert_shift_group_when_not_exist_succeeds(self):
        self.dao.insert_one_if_not_exist(self.shift_group.copy())
        shifts = self.dao.fetch_all(profile1)
        self.assertEqual(1, len(shifts))
        self.assertEqual(self.shift_group, shifts[0])

    def test_insert_shift_group_when_exist_raises_exception(self):
        self.dao.insert_one_if_not_exist(self.shift_group.copy())
        with self.assertRaises(ShiftGroupAlreadyExistException):
            self.dao.insert_one_if_not_exist(self.shift_group_update.copy())

    def test_remove_shift_group(self):
        self.dao.insert_one_if_not_exist(self.shift_group.copy())
        shift_groups_before = self.dao.fetch_all(profile1)
        self.dao.remove(
            self.shift_group[shift_group_name], self.shift_group[profile]
        )
        shift_groups_after = self.dao.fetch_all(profile1)
        self.assertEqual(1, len(shift_groups_before))
        self.assertEqual(0, len(shift_groups_after))

    def test_update_shift_group(self):
        self.dao.insert_one_if_not_exist(self.shift_group.copy())
        self.dao.update(self.shift_group_update.copy())
        shift_group = self.dao.find_by_name(
            self.shift_group[shift_group_name], self.shift_group[profile]
        )
        self.assertEqual(self.shift_group_update, shift_group)

    def test_get_shift_groups_including_shifts(self):
        self.dao.insert_one_if_not_exist(self.shift_group.copy())
        night_shift_group = self.dao.get_including_shifts(["Night"], profile1)
        early_shift_group = self.dao.get_including_shifts(["Early"], profile1)
        self.assertEqual(0, len(night_shift_group))
        self.assertEqual(1, len(early_shift_group))
        self.assertEqual(self.shift_group, early_shift_group[0])

    def test_get_shift_groups_including_shift_types(self):
        self.dao.insert_one_if_not_exist(self.shift_group.copy())
        night_shift_group = self.dao.get_including_shift_types(["Night"], profile1)
        day_shift_group = self.dao.get_including_shift_types(["Day"], profile1)
        self.assertEqual(0, len(night_shift_group))
        self.assertEqual(1, len(day_shift_group))
        self.assertEqual(self.shift_group, day_shift_group[0])

    def test_add_shift_to_nonexistent_shift_group_raise_error(self):
        with self.assertRaises(ShiftNotExist):
            self.dao.add_shift_to_shift_group_list("Work", "Late", profile1)

    def test_add_shift_to_existing_shift_group_succeed(self):
        self.dao.insert_one_if_not_exist(self.shift_group.copy())
        shift_group_before = self.dao.find_by_name("Work", profile1)
        self.dao.add_shift_to_shift_group_list("Work", "Late", profile1)
        shift_group_after = self.dao.find_by_name("Work", profile1)
        self.assertEqual(
            ["Early", "Midnight"],
            shift_group_before[shift_group_shifts_list],
        )
        self.assertEqual(["Day"], shift_group_before[shift_group_shift_types])
        self.assertEqual(
            ["Early", "Midnight", "Late"],
            shift_group_after[shift_group_shifts_list],
        )
        non_existent_shift_group = self.dao.find_by_name("Work", "profile2")
        self.assertEqual(None, non_existent_shift_group)

    def test_remove_shift_to_nonexistent_group_raise_error(self):
        with self.assertRaises(ShiftNotExist):
            self.dao.delete_shift_from_shift_group_list(
                "Work", "Early", profile1
            )

    def test_remove_shift_from_existing_group_succeed(self):
        self.dao.insert_one_if_not_exist(self.shift_group.copy())
        shift_group_before = self.dao.find_by_name("Work", profile1)
        self.dao.delete_shift_from_shift_group_list("Work", "Early", profile1)
        shift_group_after = self.dao.find_by_name("Work", profile1)
        self.assertEqual(
            ["Early", "Midnight"],
            shift_group_before[shift_group_shifts_list],
        )
        self.assertEqual(
            ["Midnight"], shift_group_after[shift_group_shifts_list]
        )

    def test_remove_shift_type_from_existing_group_succeed(self):
        self.dao.insert_one_if_not_exist(self.shift_group.copy())
        shift_group_before = self.dao.find_by_name("Work", profile1)
        self.dao.delete_shift_type_from_shift_group_list("Work", "Day", profile1)
        shift_group_after = self.dao.find_by_name("Work", profile1)
        self.assertEqual(
            ["Day"],
            shift_group_before[shift_group_shift_types],
        )
        self.assertEqual(
            [], shift_group_after[shift_group_shift_types]
        )

    def test_delete_all_shift_groups_from_profile_deletes_items_for_profile(
        self,
    ):
        self.dao.insert_one_if_not_exist(self.shift_group.copy())
        profile1_shift_groups_before = self.dao.fetch_all(profile1)
        self.dao.duplicate(profile1, profile2)
        self.dao.delete_all(profile1)
        profile1_shift_groups_after = self.dao.fetch_all(profile1)
        profile2_shift_groups = self.dao.fetch_all(profile2)
        self.assertEqual(1, len(profile1_shift_groups_before))
        self.assertEqual(1, len(profile2_shift_groups))
        self.assertEqual(0, len(profile1_shift_groups_after))
