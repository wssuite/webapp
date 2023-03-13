import uuid
from unittest import TestCase
from unittest.mock import patch
import bcrypt
from src.handlers.user_handler import AuthenticationHandler, User
from src.dao.abstract_dao import connect_to_fake_db
from test_constants import default_user, random_hex
from constants import (
    utf8,
    admin,
    user_username,
    user_token,
    user_password,
    empty_token,
    is_admin,
)
from src.exceptions.user_exceptions import (
    UserNotExist,
    WrongPassword,
    TokenInvalid,
    AdminOnlyAction,
    UserAlreadyExist,
    CannotDeleteAdmin,
    LoginRequired,
)
from test_constants import test_profile, profile1


def uuid_side_effect():
    return uuid.UUID(hex=random_hex)


class TestAuthenticationHandler(TestCase):
    def setUp(self) -> None:
        self.handler = AuthenticationHandler(connect_to_fake_db())
        user = User().from_json(default_user.copy())
        password = str(user.password).encode(utf8)
        salt = bcrypt.gensalt()
        password_hash = bcrypt.hashpw(password, salt)
        db_user = user.db_json()
        db_user[user_password] = password_hash
        self.handler.user_dao.insert_one(db_user)
        self.handler.profile_dao.insert_if_not_exist(test_profile.copy())

    def tearDown(self) -> None:
        pass

    @patch("uuid.uuid4")
    def test_login_when_user_exists_succeed(self, mock_uuid):
        mock_uuid.side_effect = uuid_side_effect
        self.handler.login(default_user)
        user = self.handler.user_dao.find_by_token(random_hex)
        self.assertEqual(admin, user[user_username])
        self.assertEqual(random_hex, user[user_token])

    def test_login_when_user_not_exist_raise_error(self):
        wrong_user = default_user.copy()
        wrong_user[user_username] = "random"
        with self.assertRaises(UserNotExist):
            self.handler.login(wrong_user)

    def test_login_with_wrong_password_raise_error(self):
        wrong_password = default_user.copy()
        wrong_password[user_password] = "random"
        with self.assertRaises(WrongPassword):
            self.handler.login(wrong_password)

    def test_create_user_when_not_logged_in_raise_error(self):
        user1_dict = {user_username: "user", user_password: "passw0rd"}
        user1 = User().from_json(user1_dict)
        with self.assertRaises(LoginRequired):
            self.handler.create_user(user1.db_json(), empty_token)

    @patch("uuid.uuid4")
    def test_create_user_when_logged_in_as_admin_if_not_exist_succeed(
        self, mock_uuid
    ):
        new_user_dict = self.create_additional_user_as_admin(mock_uuid)
        db_dict = self.handler.user_dao.find_by_username("user")
        new_user_dict[user_token] = empty_token
        self.assertEqual(new_user_dict[user_username], db_dict[user_username])
        self.assertEqual(new_user_dict[user_token], db_dict[user_token])

    @patch("uuid.uuid4")
    def test_create_user_when_logged_in_if_exist_raise_error(self, mock_uuid):
        mock_uuid.side_effect = uuid_side_effect
        self.handler.login(default_user)
        user = User().from_json(default_user)
        with self.assertRaises(UserAlreadyExist):
            self.handler.create_user(user.db_json(), random_hex)

    def test_create_user_with_invalid_token_raise_error(self):
        self.handler.login(default_user)
        user = User().from_json(default_user)
        with self.assertRaises(TokenInvalid):
            self.handler.create_user(user.db_json(), random_hex)

    @patch("uuid.uuid4")
    def test_create_user_when_not_admin_raise_error(self, mock_uuid):
        user1_dict = self.create_additional_user_as_admin(mock_uuid)
        self.handler.logout(random_hex)
        ret_login = self.handler.login(user1_dict)
        expected_login = {
            user_token: random_hex,
            is_admin: False,
            user_username: user1_dict[user_username],
        }
        user2_dict = {user_username: "user2", user_password: "passw0rd"}
        user2 = User().from_json(user2_dict)
        with self.assertRaises(AdminOnlyAction):
            self.handler.create_user(user2.db_json(), random_hex)
        self.assertEqual(expected_login, ret_login)

    def create_additional_user_as_admin(self, mock_uuid):
        mock_uuid.side_effect = uuid_side_effect
        user1_dict = {user_username: "user", user_password: "passw0rd"}
        user1 = User().from_json(user1_dict)
        ret_login = self.handler.login(default_user)
        self.handler.create_user(user1.db_json(), random_hex)
        expected_login = {
            user_token: random_hex,
            is_admin: True,
            user_username: admin,
        }
        self.assertEqual(expected_login, ret_login)
        return user1_dict

    @patch("uuid.uuid4")
    def test_delete_user_as_admin_succeeds(self, mock_uuid):
        user1_dict = self.create_additional_user_as_admin(mock_uuid)
        self.handler.delete_user(user1_dict[user_username], random_hex)
        self.assertEqual(
            None,
            self.handler.user_dao.find_by_username(user1_dict[user_username]),
        )

    @patch("uuid.uuid4")
    def test_delete_user_with_profile_access_removes_access_from_user(
        self, mock_uuid
    ):
        user1_dict = self.create_additional_user_as_admin(mock_uuid)
        self.handler.profile_dao.add_access_to_user(
            profile1, [user1_dict[user_username]]
        )
        profiles_before = self.handler.profile_dao.fetch_all_with_user_access(
            user1_dict[user_username]
        )
        self.handler.delete_user(user1_dict[user_username], random_hex)
        profiles_after = self.handler.profile_dao.fetch_all_with_user_access(
            user1_dict[user_username]
        )
        self.assertEqual(1, len(profiles_before))
        self.assertEqual(0, len(profiles_after))

    @patch("uuid.uuid4")
    def test_delete_user_as_not_admin_raise_error(self, mock_uuid):
        user1_dict = self.create_additional_user_as_admin(mock_uuid)
        user2_dict = {user_username: "user2", user_password: "passw0rd"}
        user2 = User().from_json(user2_dict)
        self.handler.create_user(user2.db_json(), random_hex)
        self.handler.logout(random_hex)
        self.handler.login(user1_dict)
        with self.assertRaises(AdminOnlyAction):
            self.handler.delete_user(user2.username, random_hex)

    @patch("uuid.uuid4")
    def test_delete_admin_raise_error(self, mock_uuid):
        mock_uuid.side_effect = uuid_side_effect
        self.handler.login(default_user)
        with self.assertRaises(CannotDeleteAdmin):
            self.handler.delete_user(default_user[user_username], random_hex)

    @patch("uuid.uuid4")
    def test_get_all_usernames(self, mock_uuid):
        mock_uuid.side_effect = uuid_side_effect
        self.handler.login(default_user)
        actual_before = self.handler.get_all_usernames(random_hex)
        expected_before = ["admin"]
        self.create_additional_user_as_admin(mock_uuid)
        actual_after = self.handler.get_all_usernames(random_hex)
        expected_after = ["admin", "user"]
        self.assertEqual(expected_before, actual_before)
        self.assertEqual(expected_after, actual_after)
