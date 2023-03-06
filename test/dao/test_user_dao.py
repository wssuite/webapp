from src.dao.abstract_dao import connect_to_fake_db
from constants import user_username, user_password, user_token, empty_token
from unittest import TestCase
from src.dao.user_dao import UserDao
from src.models.user import User


class TestUserDao(TestCase):
    def setUp(self) -> None:
        self.user_dict = {user_username: "admin", user_password: "admin"}
        self.user_dict_update = self.user_dict.copy()
        self.random_token = "wdwqfewfe"
        self.user_dict_update[user_token] = self.random_token
        self.dao = UserDao(connect_to_fake_db())

    def tearDown(self) -> None:
        pass

    def insert_test_user(self):
        user = User().from_json(self.user_dict)
        self.dao.insert_one(user.db_json().copy())
        return user

    def test_insert_one_user(self):
        user = self.insert_test_user()
        ret = self.dao.find_by_username(user.username)
        expected = self.user_dict.copy()
        expected[user_token] = empty_token
        self.assertEqual(expected, ret)

    def test_update_user(self):
        user = self.insert_test_user()
        self.dao.update(self.user_dict_update)
        ret = self.dao.find_by_username(user.username)
        self.assertEqual(self.user_dict_update, ret)

    def test_find_user_by_token(self):
        user = self.insert_test_user()
        ret1 = self.dao.find_by_token(empty_token)
        ret2 = self.dao.find_by_token(self.random_token)
        self.assertEqual(None, ret2)
        self.assertEqual(user.to_json(), ret1)

    def test_remove_user(self):
        user = self.insert_test_user()
        ret_before = self.dao.find_by_username(user.username)
        self.dao.remove(user.username)
        ret_after = self.dao.find_by_username(user.username)
        self.assertEqual(None, ret_after)
        self.assertEqual(user.to_json(), ret_before)

    def test_fetch_all_usernames(self):
        self.insert_test_user()
        actual = self.dao.fetch_all_usernames()
        expected = [{user_username: self.user_dict[user_username]}]
        self.assertEqual(expected, actual)
