from src.handlers.base_handler import BaseHandler
from src.models.profile import Profile
from constants import (
    user_username,
    work_shift_group,
    profile,
    rest_shift_group,
)
from src.models.shift_group import ShiftGroup


class ProfileHandler(BaseHandler):
    def __init__(self, mongo):
        super().__init__(mongo)

    def create_profile(self, token, profile_name):
        user = self.verify_token(token)
        profile_object = Profile()
        profile_object.name = profile_name
        profile_object.creator = user[user_username]
        profile_object.access = [user[user_username]]
        self.profile_dao.insert_if_not_exist(profile_object.db_json())
        w_group_dict = work_shift_group.copy()
        w_group_dict[profile] = profile_name
        w_group = ShiftGroup().from_json(w_group_dict)
        self.shift_group_dao.insert_one_if_not_exist(w_group.db_json())
        r_group_dict = rest_shift_group.copy()
        r_group_dict[profile] = profile_name
        r_group = ShiftGroup().from_json(r_group_dict)
        self.shift_group_dao.insert_one_if_not_exist(r_group.db_json())

    def get_all_profiles(self, token):
        user = self.verify_token(token)
        return self.profile_dao.fetch_all_with_user_access(user[user_username])

    def delete_profile(self, token, name):
        self.verify_profile_creator_access(token, name)
        self.profile_dao.remove(name)
        self.shift_dao.delete_all(name)
        self.skill_dao.delete_all(name)
        self.shift_type_dao.delete_all(name)
        self.shift_group_dao.delete_all(name)
        self.contract_dao.delete_all(name)
        self.nurse_dao.delete_all(name)
        self.nurse_group_dao.delete_all(name)

    def duplicate(self, token, name, other_name):
        self.verify_profile_accessors_access(token, name)
        self.create_profile(token, other_name)
        self.shift_dao.duplicate(name, other_name)
        self.skill_dao.duplicate(name, other_name)
        self.shift_type_dao.duplicate(name, other_name)
        self.shift_group_dao.duplicate(name, other_name)
        self.contract_dao.duplicate(name, other_name)
        self.nurse_dao.duplicate(name, other_name)
        self.nurse_group_dao.duplicate(name, other_name)

    def share(self, token, name, other_user):
        self.verify_profile_accessors_access(token, name)
        self.profile_dao.add_access_to_user(name, other_user)

    def revoke_access(self, token, name, user):
        self.verify_profile_accessors_access(token, name)
        self.profile_dao.remove_access_from_user(name, user)

    def get_accessors_list(self, token, name):
        self.verify_profile_accessors_access(token, name)
        return self.profile_dao.get_accessors_list(name)
