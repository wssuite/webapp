from src.dao.abstract_dao import AbstractDao
from constants import (
    nurse_group_name,
    mongo_id_field,
    mongo_set_operation,
    mongo_all_operation,
    nurse_group_nurses_list,
    nurse_group_contracts_list, profile
)
from pymongo.collection import Collection
from src.models.nurse_group import NurseGroup
from src.exceptions.nurse_exceptions import NurseGroupAlreadyExist


def get_nurse_groups_from_cursor(cursor):
    nurse_groups = []
    for nurse_group in cursor:
        nurse_group = NurseGroup().from_json(nurse_group)
        nurse_groups.append(nurse_group.to_json())
    return nurse_groups


class NurseGroupDao(AbstractDao):
    def __init__(self, mongo):
        super().__init__(mongo)
        self.collection: Collection = self.db.nurse_groups

    def insert_one_if_not_exist(self, nurse_group):
        exist = self.exist(nurse_group[nurse_group_name],
                           nurse_group[profile])
        if exist is True:
            raise NurseGroupAlreadyExist(nurse_group[nurse_group_name])
        self.collection.insert_one(nurse_group)

    def find_by_name(self, name, profile_name):
        return self.collection.find_one(
            {nurse_group_name: name, profile: profile_name},
            {mongo_id_field: 0}
        )

    def exist(self, name, profile_name):
        nurse_group = self.find_by_name(name, profile_name)
        return nurse_group is not None

    def get_with_contracts(self, contracts, profile_name):
        cursor = self.collection.find(
            {nurse_group_contracts_list: {mongo_all_operation: contracts},
             profile: profile_name},
            {mongo_id_field: 0},
        )
        return get_nurse_groups_from_cursor(cursor)

    def get_with_nurses(self, nurses, profile_name):
        cursor = self.collection.find(
            {nurse_group_nurses_list: {mongo_all_operation: nurses},
             profile: profile_name},
            {mongo_id_field: 0},
        )
        return get_nurse_groups_from_cursor(cursor)

    def fetch_all(self, profile_name):
        cursor = self.collection.find({profile: profile_name}, {mongo_id_field: 0})
        return get_nurse_groups_from_cursor(cursor)

    def update(self, nurse_group):
        self.collection.find_one_and_update(
            {nurse_group_name: nurse_group[nurse_group_name],
             profile: nurse_group[profile]},
            {mongo_set_operation: nurse_group},
        )

    def remove(self, name, profile_name):
        self.collection.find_one_and_delete(
            {nurse_group_name: name, profile: profile_name})
