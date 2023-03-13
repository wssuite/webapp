from src.models.profile import Profile
from test_constants import test_profile
from unittest import TestCase


class TestProfile(TestCase):
    def setUp(self) -> None:
        self.dict = test_profile

    def test_profile_creation_from_json(self):
        actual = Profile().from_json(self.dict)
        self.assertEqual(self.dict, actual.db_json())
