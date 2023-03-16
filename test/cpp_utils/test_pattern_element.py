import unittest

from constants import pattern_element_shift, pattern_element_day
from src.models.pattern_element import PatternElement


class TestPatternElement(unittest.TestCase):
    def setUp(self) -> None:
        pass

    def tearDown(self) -> None:
        pass

    def test_create_pattern_element_from_string_create_structure(self):
        string = "Monday|Tuesday|Wednesday" \
                 "|Thursday|Friday|Saturday|Sunday," \
                 "Early"
        expected_element = {
            pattern_element_shift: ["Early"],
            pattern_element_day: ["Monday", "Tuesday",
                                  "Wednesday", "Thursday",
                                  "Friday", "Saturday",
                                  "Sunday"]
        }
        element = PatternElement().read_line(string)
        self.assertEqual(expected_element, element.to_json())
