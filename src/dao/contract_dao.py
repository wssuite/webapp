from src.dao.abstract_dao import AbstractDao
from pymongo.collection import Collection
from constants import (contract_name,
                       mongo_id_field,
                       mongo_set_operation)
from src.exceptions.contract_exceptions import (
    ContractAlreadyExistException,
)


class ContractDao(AbstractDao):
    def __init__(self, mongo):
        super().__init__(mongo)
        self.collection: Collection = self.db.contracts

    """
        This method is validating the contract with its
        subcontracts before adding it to the db
    """

    def insert_one(self, contract: dict):
        exist = self.contract_exist(contract[contract_name])
        if exist is True:
            raise ContractAlreadyExistException(contract[contract_name])
        self.collection.insert_one(contract)

    def fetch_all_contracts(self):
        cursor = self.collection.find({},
                                      {mongo_id_field: 0})
        return [contract for contract in cursor]

    def find_contract_by_name(self, name):
        return self.collection.find_one(
            {contract_name: name},
            {mongo_id_field: 0})

    def contract_exist(self, name):
        contract = self.find_contract_by_name(name)
        return contract is not None

    def update_contract(self, contract: dict):
        self.collection.find_one_and_update({contract_name:
                                            contract[contract_name]},
                                            {mongo_set_operation: contract})

    def remove_contract(self, name):
        self.collection.find_one_and_delete({contract_name: name})
