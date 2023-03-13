from src.dao.abstract_dao import AbstractDao
from src.models.nurse import Nurse
from pymongo.results import InsertOneResult
from pymongo.collection import Collection
from constants import (
    nurse_id,
    mongo_id_field,
    mongo_set_operation,
    mongo_all_operation,
    nurse_username,
    nurse_contracts,
    profile,
    nurse_contract_groups,
)
from src.exceptions.nurse_exceptions import NurseUsernameAlreadyExist


def get_nurses_from_cursor(cursor):
    return_list = []
    for nurse in cursor:
        nurse = Nurse().from_json(nurse)
        return_list.append(nurse.to_json())
    return return_list


class NurseDao(AbstractDao):
    def __init__(self, mongo):
        super().__init__(mongo)
        self.collection: Collection = self.db.nurses

    def insert_one(self, nurse: dict):
        exist = self.exist(nurse[nurse_username], nurse[profile])
        if exist is True:
            raise NurseUsernameAlreadyExist(nurse[nurse_username])

        mongo_id: InsertOneResult = self.collection.insert_one(nurse)
        self.collection.update_one(
            {mongo_id_field: mongo_id.inserted_id, profile: nurse[profile]},
            {mongo_set_operation: {nurse_id: str(mongo_id.inserted_id)}},
            upsert=False,
        )
        return mongo_id

    def fetch_all(self, profile_name):
        list_nurse = self.collection.find(
            {profile: profile_name}, {mongo_id_field: 0}
        )
        return get_nurses_from_cursor(list_nurse)

    def find_by_username(self, username, profile_name):
        return self.collection.find_one(
            {nurse_username: username, profile: profile_name},
            {mongo_id_field: 0},
        )

    def exist(self, username, profile_name):
        nurse = self.find_by_username(username, profile_name)
        return nurse is not None

    def get_with_contracts(self, contracts, profile_name):
        cursor = self.collection.find(
            {
                nurse_contracts: {mongo_all_operation: contracts},
                profile: profile_name,
            },
            {mongo_id_field: 0},
        )
        return get_nurses_from_cursor(cursor)

    def update(self, nurse_dict):
        self.collection.find_one_and_update(
            {
                nurse_username: nurse_dict[nurse_username],
                profile: nurse_dict[profile],
            },
            {mongo_set_operation: nurse_dict},
        )

    def remove(self, username, profile_name):
        self.collection.find_one_and_delete(
            {nurse_username: username, profile: profile_name}
        )

    def delete_all(self, profile_name):
        self.collection.delete_many({profile: profile_name})

    def duplicate(self, profile1, profile2):
        nurses = self.fetch_all(profile1)
        for nurse in nurses:
            nurse_object = Nurse().from_json(nurse)
            nurse_object.profile = profile2
            self.collection.insert_one(nurse_object.db_json())

    def get_with_contract_groups(self, groups, profile_name):
        cursor = self.collection.find(
            {
                nurse_contract_groups: {mongo_all_operation: groups},
                profile: profile_name,
            },
            {mongo_id_field: 0},
        )
        return get_nurses_from_cursor(cursor)
