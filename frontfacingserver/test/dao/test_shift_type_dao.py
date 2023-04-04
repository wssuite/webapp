from src.dao.shift_type_dao import ShiftTypeDao
from unittest import TestCase
from src.dao.abstract_dao import connect_to_fake_db
from constants import shift_type_name, shift_type_shifts_lists, profile
from src.exceptions.shift_exceptions import ShiftTypeAlreadyExistException
from test_constants import profile1, profile2


class TestShiftTypeDao(TestCase):
    def setUp(self) -> None:
        self.dao = ShiftTypeDao(connect_to_fake_db())
        self.shift_type = {
            shift_type_name: "Day",
            shift_type_shifts_lists: ["Early", "MidDay"],
            profile: profile1,
        }
        self.shift_type_update = {
            shift_type_name: "Day",
            shift_type_shifts_lists: [
                "Early",
                "Morning",
                "Afternoon",
                "MidDay",
            ],
            profile: profile1,
        }

    def test_insert_shift_type_when_not_exist_succeed(self):
        self.dao.insert_one_if_not_exist(self.shift_type.copy())
        all_shift_types = self.dao.fetch_all(profile1)
        self.assertEqual(1, len(all_shift_types))
        self.assertEqual(self.shift_type, all_shift_types[0])

    def test_insert_shift_type_when_exist_raises_exception(self):
        self.dao.insert_one_if_not_exist(self.shift_type.copy())
        with self.assertRaises(ShiftTypeAlreadyExistException):
            self.dao.insert_one_if_not_exist(self.shift_type_update)

    def test_remove_shift_type(self):
        self.dao.insert_one_if_not_exist(self.shift_type.copy())
        shift_type_len_before = len(self.dao.fetch_all(profile1))
        self.dao.remove(
            self.shift_type[shift_type_name], self.shift_type[profile]
        )
        shift_type_len_after = len(self.dao.fetch_all(profile1))
        self.assertEqual(1, shift_type_len_before)
        self.assertEqual(0, shift_type_len_after)

    def test_update_shift_type(self):
        self.dao.insert_one_if_not_exist(self.shift_type.copy())
        self.dao.update(self.shift_type_update)
        shift_type_updated = self.dao.find_by_name(
            self.shift_type[shift_type_name], self.shift_type[profile]
        )
        self.assertEqual(self.shift_type_update, shift_type_updated)

    def test_get_shift_types_including_shifts(self):
        self.dao.insert_one_if_not_exist(self.shift_type.copy())
        night_shift_types = self.dao.get_including_shifts(["Night"], profile1)
        self.assertEqual(0, len(night_shift_types))
        early_shift_types = self.dao.get_including_shifts(["Early"], profile1)
        self.assertEqual(1, len(early_shift_types))
        self.assertEqual(self.shift_type, early_shift_types[0])

    def test_delete_all_shift_types_from_profile_deletes_items_for_profile(
        self,
    ):
        self.dao.insert_one_if_not_exist(self.shift_type.copy())
        profile1_shift_types_before = self.dao.fetch_all(profile1)
        self.dao.duplicate(profile1, profile2)
        self.dao.delete_all(profile1)
        profile1_shift_types_after = self.dao.fetch_all(profile1)
        profile2_shift_types = self.dao.fetch_all(profile2)
        self.assertEqual(1, len(profile1_shift_types_before))
        self.assertEqual(1, len(profile2_shift_types))
        self.assertEqual(0, len(profile1_shift_types_after))
