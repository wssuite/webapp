from constants import profile_name, profile_creator, profile_access
from src.models.profile import Profile
from test_constants import test_profile, profile1
from unittest import TestCase


class TestProfile(TestCase):
    def setUp(self) -> None:
        self.dict = test_profile

    def test_profile_creation_from_json(self):
        actual = Profile().from_json(self.dict)
        self.assertEqual(self.dict, actual.db_json())

    def test_profile_creation_from_string_parse_structure(self):
        string = "name,{},,,,,,,,".format(profile1)
        expected_profile = {
            profile_name: profile1,
            profile_creator: None,
            #profile_access: []
        }
        profile = Profile().read_line(string)
        self.assertEqual(expected_profile, profile)