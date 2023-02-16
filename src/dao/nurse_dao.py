from src.dao.abstract_dao import AbstractDao
from src.cpp_utils.nurse import Nurse
from pymongo.results import InsertOneResult
from pymongo.collection import Collection
from constants import nurse_id, mongo_id_field,\
    mongo_set_operation


class NurseDao(AbstractDao):
    def __init__(self, mongo):
        super().__init__(mongo)
        self.collection: Collection = self.db.nurses

    def insert_one(self, nurse: dict) -> InsertOneResult:
        mongo_id: InsertOneResult = self.collection.insert_one(nurse)
        self.collection.update_one({mongo_id_field: mongo_id.inserted_id},
                                   {mongo_set_operation: {nurse_id:
                                    str(mongo_id.inserted_id)}},
                                   upsert=False)
        return mongo_id

    def fetch_all(self):
        list_nurse = self.collection.find({}, {mongo_id_field: 0})
        return_list = []
        for nurse in list_nurse:
            nurse_object = Nurse().from_json(nurse)
            return_list.append(nurse_object.to_json())

        return return_list
