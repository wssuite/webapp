from unittest import TestCase
from src.models.shift_type import ShiftType
from constants import shift_type_name, shift_type_shifts_lists, profile
from test_constants import profile1


class TestShiftType(TestCase):
    def setUp(self) -> None:
        self.shift_type_dict = {
            shift_type_name: "Day",
            shift_type_shifts_lists: ["Early", "MidDay"],
            profile: profile1,
        }

    def tearDown(self) -> None:
        pass

    def tests_shift_type_creation_from_json_keeps_same_json_structure(self):
        shift_type = ShiftType().from_json(self.shift_type_dict)
        self.assertEqual(self.shift_type_dict, shift_type.db_json())
