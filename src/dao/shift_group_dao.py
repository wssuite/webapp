from src.dao.abstract_dao import AbstractDao
from pymongo.collection import Collection
from constants import (
    shift_group_name,
    shift_group_shifts_list,
    mongo_id_field,
    mongo_set_operation,
    mongo_all_operation,
)
from src.exceptions.shift_exceptions import ShiftGroupAlreadyExistException
from src.cpp_utils.shift_group import ShiftGroup


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
        exist = self.exist(shift_group[shift_group_name])
        if exist is True:
            raise ShiftGroupAlreadyExistException(
                shift_group[shift_group_name]
            )
        self.collection.insert_one(shift_group)

    def find_by_name(self, name):
        return self.collection.find_one(
            {shift_group_name: name}, {mongo_id_field: 0}
        )

    def exist(self, name):
        shift_group = self.find_by_name(name)
        return shift_group is not None

    def get_including_shifts(self, shifts):
        cursor = self.collection.find(
            {shift_group_shifts_list: {mongo_all_operation: shifts}},
            {mongo_id_field: 0},
        )
        return get_shift_groups_from_cursor(cursor)

    def fetch_all(self):
        cursor = self.collection.find({}, {mongo_id_field: 0})
        return get_shift_groups_from_cursor(cursor)

    def update(self, shift_group: dict):
        self.collection.find_one_and_update(
            {shift_group_name: shift_group[shift_group_name]},
            {mongo_set_operation: shift_group},
        )

    def remove(self, name):
        self.collection.find_one_and_delete({shift_group_name: name})
