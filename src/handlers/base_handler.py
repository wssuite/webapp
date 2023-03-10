from src.dao.user_dao import UserDao
from constants import empty_token
from src.exceptions.user_exceptions import LoginRequired, TokenInvalid


class BaseHandler:
    def __init__(self, mongo):
        self.user_dao = UserDao(mongo)

    def verify_token(self, token):
        if token == empty_token:
            raise LoginRequired()
        user_dict = self.user_dao.find_by_token(token)
        if user_dict is None:
            raise TokenInvalid()
        return user_dict

    def add(self, token, json):
        self.verify_token(token)

    def update(self, token, json):
        self.verify_token(token)

    def delete(self, token, name, profile):
        self.verify_token(token)

    def get_all(self, token, profile):
        self.verify_token(token)

    def get_by_name(self, token, name, profile):
        self.verify_token(token)
