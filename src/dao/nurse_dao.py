from src.dao.abstract_dao import AbstractDao
from src.cpp_utils.nurse import Nurse
from pymongo.results import InsertOneResult
from pymongo.collection import Collection
from constants import (nurse_id,
                       mongo_id_field,
                       mongo_set_operation,
                       mongo_all_operation,
                       nurse_username,
                       nurse_contracts
                       )
from src.exceptions.nurse_exceptions import (
    NurseUsernameAlreadyExist
)


class NurseDao(AbstractDao):
    def __init__(self, mongo):
        super().__init__(mongo)
        self.collection: Collection = self.db.nurses

    def insert_one(self, nurse: dict):
        exist = self.exist(nurse[nurse_username])
        if exist is True:
            raise NurseUsernameAlreadyExist(nurse[nurse_username])

        mongo_id: InsertOneResult = self.collection.insert_one(nurse)
        self.collection.update_one(
            {mongo_id_field: mongo_id.inserted_id},
            {mongo_set_operation: {nurse_id: str(
                mongo_id.inserted_id)}},
            upsert=False)
        return mongo_id

    def fetch_all(self):
        list_nurse = self.collection.find({}, {mongo_id_field: 0})
        return_list = []
        for nurse in list_nurse:
            return_list.append(
                Nurse().from_json(nurse)
            )
        return [nurse.to_json() for nurse in
                return_list]

    def find_nurse_by_username(self, username):
        return self.collection.find_one(
            {nurse_username: username},
            {mongo_id_field: 0}
        )

    def exist(self, username):
        nurse = self.find_nurse_by_username(username)
        return nurse is not None

    def get_nurses_with_contracts(self, contracts):
        cursor = self.collection.find({nurse_contracts: {
            mongo_all_operation: contracts
        }},
            {mongo_id_field: 0})
        nurse_list = []
        for nurse_dict in cursor:
            nurse_list.append(Nurse().from_json(nurse_dict))

        return [nurse.to_json() for nurse in nurse_list]

    def update_nurse(self, nurse_dict):
        self.collection.find_one_and_update(
            {nurse_username: nurse_dict[nurse_username]},
            {mongo_set_operation: nurse_dict}
        )

    def remove_nurse(self, username):
        self.collection.find_one_and_delete(
            {nurse_username: username}
        )
