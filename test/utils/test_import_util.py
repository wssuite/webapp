import unittest

from src.utils.import_util import sanitize_array, skip_line


class TestImportUtil(unittest.TestCase):
    def test_sanitize_array_should_return_empty_array(self):
        tokens = ['', '', '', '']
        expected_output = []
        output = sanitize_array(tokens)
        self.assertEqual(expected_output, output)

    def test_skip_line_empty_line_return_true(self):
        line = ""
        verdict = skip_line(line)
        self.assertTrue(verdict)

    def test_skip_line_comma_separated_empty_string_line_return_true(self):
        line = ",,,,,,,"
        verdict = skip_line(line)
        self.assertTrue(verdict)

    def test_skip_line_commented_line_return_true(self):
        line = "#,Monday,,,,"
        verdict = skip_line(line)
        self.assertTrue(verdict)

    def test_skip_line_return_false(self):
        line = "Monday"
        verdict = skip_line(line)
        self.assertFalse(verdict)
