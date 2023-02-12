from unittest.mock import Mock
import app
from unittest import TestCase
from constants import nurse_name, nurse_contracts, nurse_id
from src.dao.abstract_dao import connect_to_fake_db
from src.dao.nurse_dao import NurseDao


class TestNurseController(TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.nurse_dict = {
            nurse_name: "random",
            nurse_contracts: ["fulltime"]
        }
        app.nurse_controller.nurse_dao = Mock()
        app.nurse_controller.nurse_dao = NurseDao(connect_to_fake_db())
        self.dao = app.nurse_controller.nurse_dao

    def tearDown(self) -> None:
        pass

    def test_register_nurse(self):
        path = "/nurse/add"

        inserted_nurse_id = self.client.post(path,
                                             json=self.nurse_dict)
        result_nurse = self.dao.collection.find_one(
            {nurse_id: inserted_nurse_id.data.decode()},
            {"_id": 0, nurse_id: 0})
        self.assertEqual(result_nurse, self.nurse_dict)
