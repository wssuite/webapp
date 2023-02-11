import mongomock
from src.dao.nurse_dao import NurseDao
from unittest import TestCase


def create_nurse_dao():
    dao = NurseDao()
    dao.collection = mongomock.MongoClient().test.nurse
    return dao


class TestNurseDao(TestCase):
    def setUp(self) -> None:
        self.nurse_dict = {
            "name": "random",
            "contracts": ["fulltime"]
        }
        self.dao = create_nurse_dao()

    def tearDown(self) -> None:
        pass

    def test_insert_one_nurse_and_verify_the_insertion(self):
        nurse_dict_entry = self.nurse_dict.copy()
        nurse_id = self.dao.insert_one(nurse_dict_entry)
        collection = self.dao.collection
        result = collection.find_one({"id_nurse": str(nurse_id.inserted_id)})
        self.assertEqual(result["name"], "random")

    def test_get_the_list_of_nurses(self):
        nurse_dict_entry = self.nurse_dict.copy()
        nurse_id = self.dao.insert_one(nurse_dict_entry)
        result_nurse_dict = self.nurse_dict
        result_nurse_dict["id_nurse"] = str(nurse_id.inserted_id)
        nurses_list = self.dao.fetch_all()
        self.assertEqual(nurses_list, [result_nurse_dict])
