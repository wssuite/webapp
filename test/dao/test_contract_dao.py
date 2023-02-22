from unittest.mock import Mock

from src.dao.abstract_dao import connect_to_fake_db
from src.dao.contract_dao import ContractDao
import src.dao.contract_dao
from unittest import TestCase
from test_constants import (
    general_contract_dict,
    full_time_valid_contract_with_general,
)
from constants import contract_name, mongo_id_field
from src.exceptions.contract_exceptions import (
    ContractAlreadyExistException,
)


class TestContractDao(TestCase):
    def setUp(self) -> None:
        src.dao.contract_dao.get_subcontract_limit = Mock()
        src.dao.contract_dao.get_subcontract_limit.return_value = 20
        self.dao = ContractDao(connect_to_fake_db())

    def tearDown(self) -> None:
        pass

    def test_insert_contract_when_not_exist_get_created(self):
        self.dao.insert_one(general_contract_dict.copy())
        fetched_dict = self.dao.collection.find_one(
            {contract_name: general_contract_dict[
                contract_name]}, {mongo_id_field: 0}
        )
        self.assertEqual(general_contract_dict, fetched_dict)

    def test_insert_contract_when_exist_raise_exception(self):
        self.dao.insert_one(general_contract_dict.copy())
        with self.assertRaises(ContractAlreadyExistException):
            self.dao.insert_one(general_contract_dict.copy())

    def test_fetch_all_contract_names(self):
        self.dao.insert_one(general_contract_dict.copy())
        self.dao.insert_one(full_time_valid_contract_with_general.copy())
        contract_list = [
            general_contract_dict,
            full_time_valid_contract_with_general,
        ]
        fetched_list = self.dao.fetch_all_contracts()
        self.assertEqual(contract_list, fetched_list)
