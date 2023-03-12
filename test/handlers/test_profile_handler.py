from src.dao.abstract_dao import connect_to_fake_db
from unittest import TestCase
from src.handlers.profile_handler import ProfileHandler
from test_constants import (
    profile1,
    default_user,
    random_hex,
    user1,
    random_hex2,
    test_profile,
    profile_access,
    user1_name,
    admin,
)
from constants import user_token
from src.models.user import User
from src.exceptions.user_exceptions import ProfileAccessException


class TestProfileHandler(TestCase):
    def setUp(self) -> None:
        self.handler = ProfileHandler(connect_to_fake_db())
        user_dict = default_user.copy()
        user_dict[user_token] = random_hex
        user = User().from_json(user_dict)
        self.handler.user_dao.insert_one(user.db_json())
        self.handler.user_dao.insert_one(user1)

    def tearDown(self) -> None:
        pass

    def test_create_profile(self):
        self.handler.create_profile(random_hex, profile1)
        all_profiles = self.handler.profile_dao.fetch_all()
        self.assertEqual(1, len(all_profiles))
        expected = test_profile.copy()
        expected.pop(profile_access)
        self.assertEqual(expected, all_profiles[0])

    def test_get_all_profiles_change_with_access(self):
        self.handler.create_profile(random_hex, profile1)
        admin_profiles = self.handler.get_all_profiles(random_hex)
        user1_profiles_before = self.handler.get_all_profiles(random_hex2)
        self.handler.share(random_hex, profile1, user1_name)
        user1_profiles_after = self.handler.get_all_profiles(random_hex2)
        self.assertEqual(0, len(user1_profiles_before))
        self.assertEqual(1, len(admin_profiles))
        self.assertEqual(admin_profiles, user1_profiles_after)

    def test_revoke_access(self):
        self.handler.create_profile(random_hex, profile1)
        self.handler.share(random_hex, profile1, user1_name)
        self.handler.revoke_access(random_hex, profile1, user1_name)
        user1_profiles_after = self.handler.get_all_profiles(random_hex2)
        self.assertEqual(0, len(user1_profiles_after))

    def test_duplicate_when_not_have_access_raise_error(self):
        self.handler.create_profile(random_hex, profile1)
        with self.assertRaises(ProfileAccessException):
            self.handler.duplicate(random_hex2, profile1, "profile2")

    def test_duplicate_profile_when_have_access_creates_duplicate(self):
        self.handler.create_profile(random_hex, profile1)
        self.handler.share(random_hex, profile1, user1_name)
        self.handler.duplicate(random_hex2, profile1, "profile2")
        all_profiles = self.handler.profile_dao.fetch_all()
        new_profile = self.handler.profile_dao.find_by_name("profile2")
        self.assertEqual(2, len(all_profiles))
        self.assertNotEqual(None, new_profile)

    def test_delete_profile_when_not_creator_raise_error(self):
        self.handler.create_profile(random_hex, profile1)
        self.handler.share(random_hex, profile1, user1_name)
        with self.assertRaises(ProfileAccessException):
            self.handler.delete_profile(random_hex2, profile1)
        all_profiles = self.handler.profile_dao.fetch_all()
        self.assertEqual(1, len(all_profiles))

    def test_delete_profile_when_creator_succeed(self):
        self.handler.create_profile(random_hex, profile1)
        self.handler.share(random_hex, profile1, user1_name)
        self.handler.delete_profile(random_hex, profile1)
        all_profiles = self.handler.profile_dao.fetch_all()
        self.assertEqual(0, len(all_profiles))

    def test_get_accessors_list(self):
        self.handler.create_profile(random_hex, profile1)
        actual = self.handler.get_accessors_list(random_hex, profile1)
        expected = [admin]
        self.assertEqual(expected, actual)
