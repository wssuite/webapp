from src.example.Personnel import Personnel
from unittest import TestCase


class TestPersonnel(TestCase):

    def setUp(self) -> None:
        self.personnel_data = {
            "name": "random",
            "contract_type": "random"
        }
        self.correct_personnel = Personnel()
        self.correct_personnel.name = "random"
        self.correct_personnel.contract_type = "random"

    def test_personnel_creation(self):
        created_personnel = Personnel().from_json(self.personnel_data)
        self.assertTrue(created_personnel.name ==
                        self.correct_personnel.name)
        self.assertTrue(created_personnel.contract_type
                        == self.correct_personnel.contract_type)

    def test_personnel_to_string(self):
        self.assertTrue(str(self.correct_personnel)
                        == "random random")

    def tearDown(self) -> None:
        pass
