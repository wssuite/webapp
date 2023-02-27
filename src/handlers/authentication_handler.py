import uuid
from src.models.user import User
from src.dao.user_dao import UserDao
from src.exceptions.user_exceptions import (
    UserAlreadyExist,
    UserNotExist,
    WrongPassword,
    TokenInvalid,
    AdminOnlyAction,
    CannotDeleteAdmin,
    LoginRequired,
)
import bcrypt
from constants import (
    utf8,
    user_password,
    user_token,
    empty_token,
    admin,
    user_username,
)


class AuthenticationHandler:
    def __init__(self, mongo):
        self.user_dao = UserDao(mongo)

    def user_exist(self, username):
        user = self.user_dao.find_by_username(username)
        return user is not None

    def verify_token(self, token):
        if token == empty_token:
            raise LoginRequired()
        user_dict = self.user_dao.find_by_token(token)
        if user_dict is None:
            raise TokenInvalid()
        return user_dict

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
        match = bcrypt.checkpw(
            str(user.password).encode(utf8), hashed_password
        )
        if match is False:
            raise WrongPassword
        token = uuid.uuid4().hex
        user_dict[user_token] = token
        self.user_dao.update(user_dict)
        return token

    def logout(self, token):
        user_dict = self.verify_token(token)
        user_dict[user_token] = empty_token
        self.user_dao.update(user_dict)

    def delete(self, username, token):
        self.verify_user_is_admin(token)
        if username == admin:
            raise CannotDeleteAdmin()
        self.user_dao.remove(username)
