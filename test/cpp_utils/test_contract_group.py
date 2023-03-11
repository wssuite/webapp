from unittest import TestCase
from test_constants import contract_group_without_contradiction
from src.models.contract_group import ContractGroup


class TestContractGroup(TestCase):
    def setUp(self) -> None:
        self.dict = contract_group_without_contradiction.copy()

    def tearDown(self) -> None:
        pass

    def test_contract_group_creation_from_json(self):
        group = ContractGroup().from_json(self.dict)
        self.assertEqual(contract_group_without_contradiction, group.db_json())
