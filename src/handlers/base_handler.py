from src.dao.user_dao import UserDao
from constants import empty_token
from src.exceptions.user_exceptions import LoginRequired, TokenInvalid
from src.dao.contract_dao import ContractDao
from src.dao.nurse_dao import NurseDao
from src.dao.nurse_group_dao import NurseGroupDao
from src.dao.shift_dao import ShiftDao
from src.dao.shift_type_dao import ShiftTypeDao
from src.dao.shift_group_dao import ShiftGroupDao
from src.dao.skill_dao import SkillDao
from src.dao.profile_dao import ProfileDao


class BaseHandler:
    def __init__(self, mongo):
        self.user_dao = UserDao(mongo)
        self.contract_dao = ContractDao(mongo)
        self.nurse_dao = NurseDao(mongo)
        self.nurse_group_dao = NurseGroupDao(mongo)
        self.shift_dao = ShiftDao(mongo)
        self.shift_type_dao = ShiftTypeDao(mongo)
        self.shift_group_dao = ShiftGroupDao(mongo)
        self.skill_dao = SkillDao(mongo)
        self.profile_dao = ProfileDao(mongo)

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
