from src.dao.abstract_dao import AbstractDao
from pymongo.collection import Collection
from constants import shift_name, mongo_id_field, mongo_set_operation
from src.exceptions.shift_exceptions import ShiftAlreadyExistException
from src.cpp_utils.shift import Shift


class ShiftDao(AbstractDao):
    def __init__(self, mongo):
        super().__init__(mongo)
        self.collection: Collection = self.db.shifts

    def insert_one_if_not_exist(self, shift: dict):
        exist = self.exist(shift[shift_name])
        if exist is True:
            raise ShiftAlreadyExistException(shift[shift_name])

        self.collection.insert_one(shift)

    def find_by_name(self, name):
        return self.collection.find_one(
            {shift_name: name}, {mongo_id_field: 0}
        )

    def exist(self, name):
        shift = self.find_by_name(name)
        return shift is not None

    def fetch_all(self):
        cursor = self.collection.find({}, {mongo_id_field: 0})
        shifts = []
        for shift_dict in cursor:
            shift = Shift().from_json(shift_dict)
            shifts.append(shift.to_json())
        return shifts

    def remove(self, name):
        self.collection.find_one_and_delete({shift_name: name})

    def update(self, shift: dict):
        self.collection.find_one_and_update(
            {shift_name: shift[shift_name]}, {mongo_set_operation: shift}
        )
