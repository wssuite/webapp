from src.dao.nurse_dao import NurseDao
from unittest import TestCase
from src.dao.abstract_dao import connect_to_fake_db
from constants import nurse_name, nurse_contracts, nurse_id


def create_nurse_dao():
    dao = NurseDao(connect_to_fake_db())
    return dao


class TestNurseDao(TestCase):
    def setUp(self) -> None:
        self.nurse_dict = {
            nurse_name: "random",
            nurse_contracts: ["fulltime"]
        }
        self.dao = create_nurse_dao()

    def tearDown(self) -> None:
        pass

    def test_insert_one_nurse_and_verify_the_insertion(self):
        nurse_dict_entry = self.nurse_dict.copy()
        nurse_id_inserted = self.dao.insert_one(nurse_dict_entry)
        collection = self.dao.collection
        result = collection.find_one({nurse_id:
                                     str(nurse_id_inserted.inserted_id)})
        self.assertEqual(result[nurse_name], "random")

    def test_get_the_list_of_nurses(self):
        nurse_dict_entry = self.nurse_dict.copy()
        dao = create_nurse_dao()
        nurse_id_inserted = dao.insert_one(nurse_dict_entry)
        result_nurse_dict = self.nurse_dict
        result_nurse_dict[nurse_id] = str(nurse_id_inserted.inserted_id)
        nurses_list = dao.fetch_all()
        self.assertEqual(nurses_list, [result_nurse_dict])
