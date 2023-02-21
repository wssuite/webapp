from src.dao.abstract_dao import connect_to_fake_db
from src.dao.contract_dao import ContractDao
from unittest import TestCase
from test_constants import (
    general_contract_dict,
    full_time_not_valid_contract_with_general,
    full_time_valid_contract_with_general,
)
from constants import contract_name, mongo_id_field
from src.exceptions.contract_exceptions import (
    ContractAlreadyExistException,
    ContractCreationContradictionException,
)


class TestContractDao(TestCase):
    def setUp(self) -> None:
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

    def test_insert_contract_contradict_submodule_raise_exception(self):
        self.dao.insert_one(general_contract_dict.copy())
        with self.assertRaises(ContractCreationContradictionException):
            self.dao.insert_one(full_time_not_valid_contract_with_general)

    def test_insert_contract_valid_with_submodule_get_created(self):
        self.dao.insert_one(general_contract_dict.copy())
        self.dao.insert_one(full_time_valid_contract_with_general.copy())
        fetched_dict = self.dao.collection.find_one(
            {contract_name: full_time_valid_contract_with_general[
                contract_name]},
            {mongo_id_field: 0},
        )

        self.assertEqual(full_time_valid_contract_with_general, fetched_dict)

    def test_fetch_all_contract_names(self):
        self.dao.insert_one(general_contract_dict.copy())
        self.dao.insert_one(full_time_valid_contract_with_general.copy())
        contract_list = [
            general_contract_dict[contract_name],
            full_time_valid_contract_with_general[contract_name],
        ]
        fetched_list = self.dao.fetch_all_contract_names()
        self.assertEqual(contract_list, fetched_list)
