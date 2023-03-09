from pymongo.collection import Collection
from src.models.profile import Profile
from src.dao.abstract_dao import AbstractDao
from constants import (
    profile_name,
    profile_access,
    mongo_id_field, mongo_all_operation, mongo_set_operation
)
from src.exceptions.profile_exceptions import ProfileAlreadyExist


def get_profiles_from_cursor(cursor):
    profiles = []
    for profile_dict in cursor:
        profile = Profile().from_json(profile_dict)
        profiles.append(profile.to_json())
    return profiles


class ProfileDao(AbstractDao):
    def __init__(self, mongo):
        super().__init__(mongo)
        self.collection: Collection = self.db.profile

    def insert_if_not_exist(self, json):
        exist = self.exist(json[profile_name])
        if exist is True:
            raise ProfileAlreadyExist(json[profile_name])
        self.collection.insert_one(json)

    def find_by_name(self, name):
        return self.collection.find_one({profile_name: name},
                                        {mongo_id_field: 0})

    def exist(self, name):
        return self.find_by_name(name) is not None

    def fetch_all_with_user_access(self, username):
        cursor = self.collection.find(
            {profile_access: {mongo_all_operation: [username]}},
            {})
        return get_profiles_from_cursor(cursor)

    def fetch_all(self):
        cursor = self.collection.find(
            {}, {})
        return get_profiles_from_cursor(cursor)

    """We can suppose that the profile exists"""
    def add_access_to_user(self, name, username):
        profile_dict = self.find_by_name(name)
        access = profile_dict[profile_access]
        if username not in access:
            access.append(username)
        profile_dict[profile_access] = access
        self.collection.find_one_and_update(
            {profile_name: profile_dict[profile_name]},
            {mongo_set_operation: profile_dict})

    def remove_access_from_user(self, name, username):
        profile_dict = self.find_by_name(name)
        access: list = profile_dict[profile_access]
        if username in access:
            access.remove(username)
        profile_dict[profile_access] = access
        self.collection.find_one_and_update(
            {profile_name: profile_dict[profile_name]},
            {mongo_set_operation: profile_dict})

    def remove(self, name):
        self.collection.find_one_and_delete({profile_name: name})
