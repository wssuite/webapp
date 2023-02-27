from unittest import TestCase
from src.models.shift import Shift
from constants import shift_name, shift_start_time, shift_end_time


class TestShift(TestCase):
    def setUp(self) -> None:
        self.shift_dict = {
            shift_name: "Early",
            shift_start_time: "06:30:00",
            shift_end_time: "12:00:00",
        }

    def tearDown(self) -> None:
        pass

    def test_shift_creation_from_json_keeps_same_json_structure(self):
        shift = Shift().from_json(self.shift_dict)
        self.assertEqual(self.shift_dict, shift.db_json())
