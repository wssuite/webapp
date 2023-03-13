from src.dao.abstract_dao import AbstractDao
from pymongo.collection import Collection
from constants import shift_name, mongo_id_field, mongo_set_operation, profile
from src.exceptions.shift_exceptions import ShiftAlreadyExistException
from src.models.shift import Shift


class ShiftDao(AbstractDao):
    def __init__(self, mongo):
        super().__init__(mongo)
        self.collection: Collection = self.db.shifts

    def insert_one_if_not_exist(self, shift: dict):
        exist = self.exist(shift[shift_name], shift[profile])
        if exist is True:
            raise ShiftAlreadyExistException(shift[shift_name])

        self.collection.insert_one(shift)

    def find_by_name(self, name, profile_name):
        return self.collection.find_one(
            {shift_name: name, profile: profile_name}, {mongo_id_field: 0}
        )

    def exist(self, name, profile_name):
        shift = self.find_by_name(name, profile_name)
        return shift is not None

    def fetch_all(self, profile_name):
        cursor = self.collection.find(
            {profile: profile_name}, {mongo_id_field: 0}
        )
        shifts = []
        for shift_dict in cursor:
            shift = Shift().from_json(shift_dict)
            shifts.append(shift.to_json())
        return shifts

    def remove(self, name, profile_name):
        self.collection.find_one_and_delete(
            {shift_name: name, profile: profile_name}
        )

    def update(self, shift: dict):
        self.collection.find_one_and_update(
            {shift_name: shift[shift_name], profile: shift[profile]},
            {mongo_set_operation: shift},
        )

    def delete_all(self, profile_name):
        self.collection.delete_many({profile: profile_name})

    def duplicate(self, profile1, profile2):
        shifts = self.fetch_all(profile1)
        for shift in shifts:
            shift_object = Shift().from_json(shift)
            shift_object.profile = profile2
            self.collection.insert_one(shift_object.db_json())
