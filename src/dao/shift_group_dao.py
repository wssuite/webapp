from src.dao.abstract_dao import AbstractDao
from pymongo.collection import Collection
from constants import (
    shift_group_name,
    shift_group_shifts_list,
    mongo_id_field,
    mongo_set_operation,
    mongo_all_operation, profile
)
from src.exceptions.shift_exceptions import (
    ShiftGroupAlreadyExistException,
    ShiftNotExist,
)
from src.models.shift_group import ShiftGroup


def get_shift_groups_from_cursor(cursor):
    shift_groups = []
    for group_dict in cursor:
        group = ShiftGroup().from_json(group_dict)
        shift_groups.append(group.to_json())
    return shift_groups


class ShiftGroupDao(AbstractDao):
    def __init__(self, mongo):
        super().__init__(mongo)
        self.collection: Collection = self.db.shift_groups

    def insert_one_if_not_exist(self, shift_group: dict):
        exist = self.exist(shift_group[shift_group_name],
                           shift_group[profile])
        if exist is True:
            raise ShiftGroupAlreadyExistException(
                shift_group[shift_group_name]
            )
        self.collection.insert_one(shift_group)

    def find_by_name(self, name, profile_name):
        return self.collection.find_one(
            {shift_group_name: name, profile: profile_name},
            {mongo_id_field: 0}
        )

    def exist(self, name, profile_name):
        shift_group = self.find_by_name(name, profile_name)
        return shift_group is not None

    def get_including_shifts(self, shifts, profile_name):
        cursor = self.collection.find(
            {shift_group_shifts_list: {mongo_all_operation: shifts},
             profile: profile_name},
            {mongo_id_field: 0},
        )
        return get_shift_groups_from_cursor(cursor)

    def fetch_all(self, profile_name):
        cursor = self.collection.find({profile: profile_name}, {mongo_id_field: 0})
        return get_shift_groups_from_cursor(cursor)

    def update(self, shift_group: dict):
        self.collection.find_one_and_update(
            {shift_group_name: shift_group[shift_group_name],
             profile: shift_group[profile]},
            {mongo_set_operation: shift_group},
        )

    def remove(self, name, profile_name):
        self.collection.find_one_and_delete(
            {shift_group_name: name, profile: profile_name})

    def add_shift_to_shift_group_list(self, name, shift_name, profile_name):
        shift_group = self.find_by_name(name, profile_name)
        if shift_group is None:
            raise ShiftNotExist(name)
        shift_group[shift_group_shifts_list].append(shift_name)
        self.update(dict(shift_group))

    def delete_shift_from_shift_group_list(self, name, shift_name, profile_name):
        shift_group = self.find_by_name(name, profile_name)
        if shift_group is None:
            raise ShiftNotExist(name)
        if shift_name in shift_group[shift_group_shifts_list]:
            shift_group[shift_group_shifts_list].remove(shift_name)
            self.update(dict(shift_group))
