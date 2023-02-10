from src.dao.abstract_dao import AbstractDao
from src.cpp_utils.nurse import Nurse
from pymongo.results import InsertOneResult


class NurseDao(AbstractDao):
    def __init__(self):
        self.collection = self.db.nurses

    def insert_one(self, nurse: dict) -> InsertOneResult:
        mongo_id: InsertOneResult = self.collection.insert_one(nurse)
        self.collection.update_one({"_id": mongo_id.inserted_id}, {"$set": {"id_nurse": str(mongo_id.inserted_id)}},
                                   upsert=False)
        return mongo_id

    def fetch_all(self):
        list_nurse = self.collection.find({})
        return_list = []
        for nurse in list_nurse:
            nurse_object = Nurse().from_json(nurse)
            return_list.append(nurse_object.to_json())

        return return_list
