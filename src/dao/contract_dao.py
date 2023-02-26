from src.dao.abstract_dao import AbstractDao
from pymongo.collection import Collection
from constants import (
    contract_name,
    mongo_id_field,
    mongo_set_operation,
    mongo_all_operation,
    contract_shifts,
)
from src.exceptions.contract_exceptions import (
    ContractAlreadyExistException,
)
from src.cpp_utils.contract import Contract


def get_contracts_from_cursor(cursor):
    contracts = []
    for contract_dict in cursor:
        contract = Contract().from_json(contract_dict)
        contracts.append(contract.to_json())
    return contracts


class ContractDao(AbstractDao):
    def __init__(self, mongo):
        super().__init__(mongo)
        self.collection: Collection = self.db.contracts

    def insert_one(self, contract: dict):
        exist = self.exist(contract[contract_name])
        if exist is True:
            raise ContractAlreadyExistException(contract[contract_name])
        self.collection.insert_one(contract)

    def fetch_all(self):
        cursor = self.collection.find({}, {mongo_id_field: 0})
        return get_contracts_from_cursor(cursor)

    def find_by_name(self, name):
        return self.collection.find_one(
            {contract_name: name}, {mongo_id_field: 0}
        )

    def exist(self, name):
        contract = self.find_by_name(name)
        return contract is not None

    def update(self, contract: dict):
        self.collection.find_one_and_update(
            {contract_name: contract[contract_name]},
            {mongo_set_operation: contract},
        )

    def remove(self, name):
        self.collection.find_one_and_delete({contract_name: name})

    def get_including_shifts(self, shifts_array):
        contracts = self.collection.find(
            {contract_shifts: {mongo_all_operation: shifts_array}}
        )
        return get_contracts_from_cursor(contracts)
