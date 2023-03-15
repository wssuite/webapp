import unittest

from src.utils.import_util import sanitize_array


class TestImportUtil(unittest.TestCase):
    def test_sanitize_array_should_return_empty_array(self):
        tokens = ['', '', '', '']
        expected_output = []
        output = sanitize_array(tokens)
        self.assertEqual(expected_output, output)
