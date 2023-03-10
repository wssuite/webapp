from src.dao.user_dao import UserDao
from constants import (
    empty_token,
    profile_creator,
    profile_access,
    user_username,
    profile,
)
from src.exceptions.user_exceptions import LoginRequired, TokenInvalid
from src.dao.contract_dao import ContractDao
from src.dao.nurse_dao import NurseDao
from src.dao.nurse_group_dao import NurseGroupDao
from src.dao.shift_dao import ShiftDao
from src.dao.shift_type_dao import ShiftTypeDao
from src.dao.shift_group_dao import ShiftGroupDao
from src.dao.skill_dao import SkillDao
from src.dao.profile_dao import ProfileDao
from src.exceptions.user_exceptions import ProfileAccessException


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

    def verify_profile_creator_access(self, token, name):
        user = self.verify_token(token)
        profile_dict = self.profile_dao.find_by_name(name)
        if user[user_username] != profile_dict[profile_creator]:
            raise ProfileAccessException(
                user[user_username], profile_dict[profile_creator])
        return profile_dict

    def verify_profile_accessors_access(self, token, name):
        user = self.verify_token(token)
        profile_dict = self.profile_dao.find_by_name(name)
        if user[user_username] not in profile_dict[profile_access]:
            raise ProfileAccessException(
                user[user_username], profile_dict[profile_access])
        return profile_dict

    """
    The following methods are used by handlers which treat a profile element
    eg: ContractHandler
    """
    def add(self, token, json):
        self.verify_profile_accessors_access(token, json[profile])

    def update(self, token, json):
        self.verify_profile_accessors_access(token, json[profile])

    def delete(self, token, name, profile_name):
        self.verify_profile_accessors_access(token, profile_name)

    def get_all(self, token, profile_name):
        self.verify_profile_accessors_access(token, profile_name)

    def get_by_name(self, token, name, profile_name):
        self.verify_profile_accessors_access(token, profile_name)
