from unittest import TestCase
from src.models.shift import Shift
from test_constants import early_shift


class TestShift(TestCase):
    def setUp(self) -> None:
        self.shift_dict = early_shift.copy()

    def tearDown(self) -> None:
        pass

    def test_shift_creation_from_json_keeps_same_json_structure(self):
        shift = Shift().from_json(self.shift_dict)
        self.assertEqual(self.shift_dict, shift.db_json())
