from src.dao.abstract_dao import connect_to_fake_db
from src.dao.contract_dao import ContractDao
from unittest import TestCase
from test_constants import (
    general_contract_dict,
    full_time_valid_contract_with_general,
    full_time_not_valid_contract_with_general,
    full_time_valid_contract_with_general_update_to_invalid, profile1
)
from constants import (
    contract_name,
    mongo_id_field,
    contract_constraints, profile
)
from src.exceptions.contract_exceptions import (
    ContractAlreadyExistException,
)
from src.models.contract import Contract


class TestContractDao(TestCase):
    def setUp(self) -> None:
        self.dao = ContractDao(connect_to_fake_db())

    def tearDown(self) -> None:
        pass

    def test_insert_contract_when_not_exist_get_created(self):
        self.dao.insert_one(general_contract_dict.copy())
        fetched_dict = self.dao.collection.find_one(
            {contract_name: general_contract_dict[contract_name]},
            {mongo_id_field: 0},
        )
        self.assertEqual(general_contract_dict, fetched_dict)

    def test_insert_contract_when_exist_raise_exception(self):
        self.dao.insert_one(general_contract_dict.copy())
        with self.assertRaises(ContractAlreadyExistException):
            self.dao.insert_one(general_contract_dict.copy())

    def test_fetch_all_contracts(self):
        self.dao.insert_one(general_contract_dict.copy())
        self.dao.insert_one(full_time_valid_contract_with_general.copy())
        contract_list = [
            general_contract_dict,
            full_time_valid_contract_with_general,
        ]
        fetched_list = self.dao.fetch_all(profile1)
        self.assertEqual(contract_list, fetched_list)

    def test_update_contract_if_contract_exist_contract_get_updated(self):
        self.dao.insert_one(full_time_valid_contract_with_general.copy())
        self.dao.update(
            full_time_valid_contract_with_general_update_to_invalid.copy()
        )
        result = self.dao.find_by_name(
            full_time_valid_contract_with_general[contract_name],
            full_time_valid_contract_with_general[profile]
        )
        self.assertEqual(
            full_time_valid_contract_with_general_update_to_invalid[
                contract_constraints
            ],
            result[contract_constraints],
        )
        self.assertEqual(
            full_time_valid_contract_with_general[contract_name],
            result[contract_name],
        )

    def test_update_contract_if_contract_not_exist_contract_not_updated(self):
        self.dao.insert_one(full_time_valid_contract_with_general.copy())
        self.dao.update(general_contract_dict.copy())
        fetch_all_contracts = self.dao.fetch_all(profile1)
        self.assertEqual(1, len(fetch_all_contracts))
        self.assertEqual(
            full_time_valid_contract_with_general, fetch_all_contracts[0]
        )

    def test_delete_contract_if_exist_get_deleted(self):
        self.dao.insert_one(full_time_valid_contract_with_general.copy())
        self.dao.remove(
            full_time_valid_contract_with_general[contract_name],
            full_time_valid_contract_with_general[profile]
        )
        fetch_all_contracts = self.dao.fetch_all(profile1)
        self.assertEqual(0, len(fetch_all_contracts))

    def test_delete_contract_if_not_exist_does_nothing(self):
        self.dao.insert_one(full_time_valid_contract_with_general.copy())
        self.dao.remove(general_contract_dict[contract_name],
                        general_contract_dict[profile])
        fetch_all_contracts = self.dao.fetch_all(profile1)
        self.assertEqual(1, len(fetch_all_contracts))

    def test_get_contracts_including_shifts(self):
        contract1 = Contract().from_json(general_contract_dict)
        contract2 = Contract().from_json(
            full_time_not_valid_contract_with_general
        )
        contract3 = Contract().from_json(full_time_valid_contract_with_general)
        self.dao.insert_one(contract1.db_json().copy())
        self.dao.insert_one(contract2.db_json().copy())
        self.dao.insert_one(contract3.db_json().copy())
        early_contracts = self.dao.get_including_shifts(["Early"], profile1)
        late_contracts = self.dao.get_including_shifts(["Late"], profile1)
        self.assertEqual(
            [full_time_valid_contract_with_general], late_contracts
        )
        self.assertEqual(
            [general_contract_dict, full_time_not_valid_contract_with_general],
            early_contracts,
        )
