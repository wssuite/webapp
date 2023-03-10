from src.handlers.base_handler import BaseHandler
from src.models.profile import Profile
from constants import user_username, profile_creator, profile_access
from src.dao.profile_dao import ProfileDao
from src.exceptions.user_exceptions import ProfileAccessException


class ProfileHandler(BaseHandler):

    def __init__(self, mongo):
        super().__init__(mongo)

    def create_profile(self, token, profile_name):
        user = self.verify_token(token)
        profile = Profile()
        profile.name = profile_name
        profile.creator = user[user_username]
        profile.access = [user[user_username]]
        self.profile_dao.insert_if_not_exist(profile.db_json())

    def get_all_profiles(self, token):
        user = self.verify_token(token)
        return self.profile_dao.fetch_all_with_user_access(
            user[user_username]
        )

    def verify_profile_creator_access(self, token, name):
        user = self.verify_token(token)
        profile = self.profile_dao.find_by_name(name)
        if user[user_username] != profile[profile_creator]:
            raise ProfileAccessException(
                user[user_username], profile[profile_creator])
        return profile

    def verify_profile_accessors_access(self, token, name):
        user = self.verify_token(token)
        profile = self.profile_dao.find_by_name(name)
        if user[user_username] not in profile[profile_access]:
            raise ProfileAccessException(
                user[user_username], profile[profile_access])
        return profile

    def delete_profile(self, token, name):
        self.verify_profile_creator_access(token, name)
        self.profile_dao.remove(name)

    def duplicate(self, token, name, other_name):
        self.verify_profile_accessors_access(token, name)
        self.create_profile(token, other_name)

    def share(self, token, name, other_user):
        self.verify_profile_accessors_access(token, name)
        self.profile_dao.add_access_to_user(name, other_user)

    def revoke_access(self, token, name, user):
        self.verify_profile_accessors_access(token, name)
        self.profile_dao.remove_access_from_user(name, user)
