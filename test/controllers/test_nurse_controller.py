from unittest.mock import patch
import app
from unittest import TestCase
from constants import nurse_name, nurse_contracts


class TestNurseController(TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.nurse_dict = {
            nurse_name: "random",
            nurse_contracts: ["fulltime"]
        }

    def tearDown(self) -> None:
        pass

    @patch("src.controllers.nurse_controller.nurse_dao")
    def test_register_nurse(self, mock_dao):
        path = "/nurse/add"
        self.client.post(path,
                         json=self.nurse_dict)
        mock_dao.insert_one.assert_called_with(self.nurse_dict)
