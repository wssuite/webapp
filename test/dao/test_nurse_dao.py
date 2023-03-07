from src.dao.nurse_dao import NurseDao, Nurse
from unittest import TestCase
from src.dao.abstract_dao import connect_to_fake_db
from constants import (
    nurse_name,
    nurse_direct_contracts,
    nurse_id,
    nurse_username,
    nurse_inherited_contracts,
)
from src.exceptions.nurse_exceptions import NurseUsernameAlreadyExist


def create_nurse_dao():
    dao = NurseDao(connect_to_fake_db())
    return dao


class TestNurseDao(TestCase):
    def setUp(self) -> None:
        self.nurse_dict = {
            nurse_name: "random",
            nurse_direct_contracts: ["FullTime"],
            nurse_username: "random",
        }
        self.nurse_invalid = {
            nurse_name: "ransom",
            nurse_username: "random",
            nurse_direct_contracts: ["FullTime"],
        }
        self.nurse_update = {
            nurse_name: "random",
            nurse_direct_contracts: ["FullTime", "random contract"],
            nurse_username: "random",
        }
        self.dao = create_nurse_dao()

    def tearDown(self) -> None:
        pass

    def test_insert_nurse_when_not_exist_succeed(self):
        nurse = Nurse().from_json(self.nurse_dict)
        nurse_id_inserted = self.dao.insert_one(nurse.db_json())
        nurse_dict = self.nurse_dict.copy()
        nurse_dict[nurse_inherited_contracts] = []
        nurse_dict[nurse_id] = str(nurse_id_inserted.inserted_id)
        all_nurses = self.dao.fetch_all()
        self.assertEqual(1, len(all_nurses))
        self.assertEqual(nurse_dict, all_nurses[0])

    def test_insert_nurse_when_username_exist_raise_exception(self):
        nurse1 = Nurse().from_json(self.nurse_dict)
        nurse2 = Nurse().from_json(self.nurse_invalid)
        self.dao.insert_one(nurse1.db_json())
        with self.assertRaises(NurseUsernameAlreadyExist):
            self.dao.insert_one(nurse2.db_json())

    def test_get_nurses_with_contracts(self):
        nurse = Nurse().from_json(self.nurse_dict)
        inserted_id = self.dao.insert_one(nurse.db_json())
        nurse_dict = self.nurse_dict.copy()
        nurse_dict[nurse_id] = str(inserted_id.inserted_id)
        nurse_dict[nurse_inherited_contracts] = []
        parTime = self.dao.get_with_contracts(["ParTime"])
        fullTime = self.dao.get_with_contracts(["FullTime"])
        self.assertEqual(0, len(parTime))
        self.assertEqual(1, len(fullTime))
        self.assertEqual(nurse_dict, fullTime[0])

    def test_update_nurse(self):
        nurse = Nurse().from_json(self.nurse_dict)
        inserted_id = self.dao.insert_one(nurse.db_json())
        self.dao.update(self.nurse_update)
        result = self.nurse_update.copy()
        result[nurse_id] = str(inserted_id.inserted_id)
        nurse_updated = self.dao.find_by_username(
            self.nurse_dict[nurse_username]
        )
        self.assertEqual(result, nurse_updated)

    def test_remove_nurse(self):
        nurse = Nurse().from_json(self.nurse_dict)
        self.dao.insert_one(nurse.db_json())
        all_nurses_before = self.dao.fetch_all()
        self.dao.remove(nurse.username)
        all_nurses_after = self.dao.fetch_all()
        self.assertEqual(1, len(all_nurses_before))
        self.assertEqual(0, len(all_nurses_after))
