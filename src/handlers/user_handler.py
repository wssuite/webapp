import uuid
from src.handlers.base_handler import BaseHandler
from src.models.user import User
from src.exceptions.user_exceptions import (
    UserAlreadyExist,
    UserNotExist,
    WrongPassword,
    AdminOnlyAction,
    CannotDeleteAdmin,
)
import bcrypt
from constants import (
    utf8,
    user_password,
    user_token,
    empty_token,
    admin,
    user_username,
    is_admin,
    profile_name,
)


class AuthenticationHandler(BaseHandler):
    def __init__(self, mongo):
        super().__init__(mongo)

    def user_exist(self, username):
        user = self.user_dao.find_by_username(username)
        return user is not None

    def verify_user_is_admin(self, token):
        user_dict = self.verify_token(token)
        if user_dict[user_username] != admin:
            raise AdminOnlyAction()

    def create_user(self, json, token):
        self.verify_user_is_admin(token)
        user = User().from_json(json)
        exist = self.user_exist(user.username)
        if exist is True:
            raise UserAlreadyExist(user.username)

        password = str(user.password)
        password_bytes = password.encode(utf8)
        salt = bcrypt.gensalt()
        password_hash = bcrypt.hashpw(password_bytes, salt)
        db_user = user.db_json()
        db_user[user_password] = password_hash
        self.user_dao.insert_one(db_user)

    def login(self, json):
        user = User().from_json(json)
        user_dict = self.user_dao.find_by_username(user.username)
        if user_dict is None:
            raise UserNotExist(user.username)
        hashed_password = user_dict[user_password]
        encoded_password = str(user.password).encode(utf8)
        match = bcrypt.checkpw(encoded_password, hashed_password)
        if match is False:
            raise WrongPassword
        token = uuid.uuid4().hex
        user_dict[user_token] = token
        self.user_dao.update(user_dict)
        ret = {user_token: token, is_admin: True, user_username: user.username}
        if user.username != admin:
            ret[is_admin] = False
        return ret

    def logout(self, token):
        user_dict = self.verify_token(token)
        user_dict[user_token] = empty_token
        self.user_dao.update(user_dict)

    def delete_user(self, username, token):
        self.verify_user_is_admin(token)
        if username == admin:
            raise CannotDeleteAdmin()
        profiles = self.profile_dao.fetch_all_with_user_access(username)
        for profile in profiles:
            self.profile_dao.remove_access_from_user(
                profile[profile_name], username
            )
        self.user_dao.remove(username)

    def get_all_usernames(self, token):
        self.verify_user_is_admin(token)
        users = self.user_dao.fetch_all_usernames()
        return [user[user_username] for user in users]
