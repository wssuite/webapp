from unittest import TestCase
from src.models.shift_group import ShiftGroup
from constants import shift_group_name, shift_group_shifts_list, profile
from test_constants import profile1


class TestShiftGroups(TestCase):
    def setUp(self) -> None:
        self.shift_group_dict = {
            shift_group_name: "Work",
            shift_group_shifts_list: ["Day", "Early", "Midnight"],
            profile: profile1,
        }

    def tearDown(self) -> None:
        pass

    def test_shift_group_creation_from_json_keeps_same_json_structure(self):
        shift_group = ShiftGroup().from_json(self.shift_group_dict)
        self.assertEqual(self.shift_group_dict, shift_group.db_json())
