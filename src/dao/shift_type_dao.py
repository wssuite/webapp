from src.dao.abstract_dao import AbstractDao
from pymongo.collection import Collection
from constants import (shift_type_name,
                       shift_type_shifts_lists,
                       mongo_id_field,
                       mongo_set_operation,
                       mongo_all_operation)
from src.exceptions.shift_exceptions import (
    ShiftTypeAlreadyExistException)


class ShiftTypeDao(AbstractDao):
    def __init__(self, mongo):
        super().__init__(mongo)
        self.collection: Collection = (self.
                                       db.shift_types)

    def insert_one_if_not_exist(self, shift_type: dict):
        exist = self.exist(shift_type[
                               shift_type_name])
        if exist is True:
            raise ShiftTypeAlreadyExistException(
                shift_type[shift_type_name])

        self.collection.insert_one(shift_type)

    def find_shift_type_by_name(self, name):
        return self.collection.find_one(
            {shift_type_name: name},
            {mongo_id_field: 0})

    def exist(self, name):
        shift_type = self.find_shift_type_by_name(
            name
        )
        return shift_type is not None

    def fetch_all_shift_types(self):
        shift_types = self.collection.find({},
                                           {mongo_id_field: 0}
                                           )
        return [shift_type for shift_type
                in shift_types]

    def remove_shift_type(self, name):
        self.collection.find_one_and_delete(
            {shift_type_name: name})

    def update_shift_type(self, shift_type: dict):
        self.collection.find_one_and_update(
            {shift_type_name: shift_type[
                shift_type_name]},
            {mongo_set_operation: shift_type})

    def get_shift_types_including_shifts(self, shifts):
        shift_types = self.collection.find(
            {shift_type_shifts_lists: {
                mongo_all_operation: shifts}},
            {mongo_id_field: 0}
        )
        return [shift_type for shift_type in shift_types]
