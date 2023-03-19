from unittest import TestCase
from src.models.shift import Shift
from test_constants import early_shift, profile1


class TestShift(TestCase):
    def setUp(self) -> None:
        self.shift_dict = early_shift.copy()

    def tearDown(self) -> None:
        pass

    def test_shift_creation_from_json_keeps_same_json_structure(self):
        shift = Shift().from_json(self.shift_dict)
        self.assertEqual(self.shift_dict, shift.db_json())

    def test_shift_creation_from_a_string_parse_shift(self):
        shift_string = "Early,08:00:00,16:00:00,,,,,,,"
        profile_name = profile1
        shift = Shift().read_shift(shift_string, profile_name)
        self.assertEqual(self.shift_dict, shift.to_json())
