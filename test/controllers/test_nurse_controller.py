from unittest.mock import Mock
import app
from unittest import TestCase
from constants import (
    nurse_name,
    nurse_direct_contracts,
    nurse_id,
    nurse_username,
    nurse_inherited_contracts,
)
from src.dao.abstract_dao import connect_to_fake_db
from src.dao.nurse_dao import NurseDao


class TestNurseController(TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.nurse_dict = {
            nurse_name: "random",
            nurse_direct_contracts: ["fulltime"],
            nurse_username: "random",
        }
        app.nurse_controller.nurse_dao = Mock()
        app.nurse_controller.nurse_dao = NurseDao(connect_to_fake_db())
        self.dao = app.nurse_controller.nurse_dao

    def tearDown(self) -> None:
        pass

    def test_register_nurse(self):
        path = "/nurse/add"

        inserted_nurse_id = self.client.post(path, json=self.nurse_dict)
        result_nurse = self.dao.collection.find_one(
            {nurse_id: inserted_nurse_id.text}, {"_id": 0, nurse_id: 0}
        )
        self.assertEqual(self.nurse_dict, result_nurse)

    def test_fetch_all_nurses(self):
        path = "/nurse/fetchAll"
        new_nurse_id = self.dao.insert_one(self.nurse_dict.copy())
        response = self.client.get(path)
        expected = self.nurse_dict.copy()
        expected[nurse_inherited_contracts] = []
        expected[nurse_id] = str(new_nurse_id.inserted_id)
        all_nurses = response.json
        self.assertEqual([expected], all_nurses)
