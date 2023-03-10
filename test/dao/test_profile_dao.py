from src.dao.abstract_dao import connect_to_fake_db
from src.exceptions.profile_exceptions import ProfileAlreadyExist
from test_constants import test_profile
from src.dao.profile_dao import ProfileDao
from unittest import TestCase
from constants import profile_name, admin, profile_access


class TestProfileDao(TestCase):
    def setUp(self) -> None:
        self.dao = ProfileDao(connect_to_fake_db())

    def tearDown(self) -> None:
        pass

    def test_insert_profile_when_not_exist_succeed(self):
        self.dao.insert_if_not_exist(test_profile.copy())
        actual = self.dao.find_by_name(test_profile[profile_name])
        self.assertEqual(test_profile, actual)

    def test_insert_profile_when_exist_raise_error(self):
        self.dao.insert_if_not_exist(test_profile.copy())
        with self.assertRaises(ProfileAlreadyExist):
            self.dao.insert_if_not_exist(test_profile.copy())

    def test_fetch_all_profiles_that_user_has_access(self):
        actual_before = self.dao.fetch_all_with_user_access(admin)
        self.dao.insert_if_not_exist(test_profile.copy())
        actual_after = self.dao.fetch_all_with_user_access(admin)
        self.assertEqual(0, len(actual_before))
        self.assertEqual(1, len(actual_after))

    def test_add_access_to_user_get_added(self):
        self.dao.insert_if_not_exist(test_profile.copy())
        self.dao.add_access_to_user(test_profile[profile_name], "user2")
        actual = self.dao.find_by_name(test_profile[profile_name])
        self.assertEqual([admin, "user2"], actual[profile_access])

    def test_remove_access_to_user_gets_removed(self):
        self.dao.insert_if_not_exist(test_profile.copy())
        self.dao.add_access_to_user(test_profile[profile_name], "user2")
        self.dao.remove_access_from_user(test_profile[profile_name], "user2")
        actual = self.dao.find_by_name(test_profile[profile_name])
        self.assertEqual([admin], actual[profile_access])

    def test_remove_a_profile(self):
        self.dao.insert_if_not_exist(test_profile.copy())
        before = self.dao.fetch_all()
        self.dao.remove(test_profile[profile_name])
        after = self.dao.fetch_all()
        self.assertEqual(1, len(before))
        self.assertEqual(0, len(after))
