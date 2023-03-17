from unittest import TestCase
from src.models.shift_group import ShiftGroup
from constants import (
    shift_group_name,
    shift_group_shifts_list,
    profile,
    shift_group_shift_types,
)
from test_constants import profile1


class TestShiftGroups(TestCase):
    def setUp(self) -> None:
        self.shift_group_dict = {
            shift_group_name: "Work",
            shift_group_shifts_list: ["Early", "Midnight"],
            profile: profile1,
            shift_group_shift_types: ["Day"],
        }

    def tearDown(self) -> None:
        pass

    def test_shift_group_creation_from_json_keeps_same_json_structure(self):
        shift_group = ShiftGroup().from_json(self.shift_group_dict)
        self.assertEqual(self.shift_group_dict, shift_group.db_json())

    def test_shift_group_creation_from_string_parse_structure(self):
        shift_types = ["Day"]
        profile_name = profile1
        shift_group_string = "Work,Early,Midnight,Day"
        shift_group = ShiftGroup().read_shift_group(
            shift_group_string, profile_name, shift_types
        )
        self.assertEqual(self.shift_group_dict, shift_group.to_json())
