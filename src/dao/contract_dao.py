from src.dao.abstract_dao import AbstractDao
from src.cpp_utils.contract import Contract
from pymongo.collection import Collection
from constants import contract_name, mongo_id_field, sub_contract_names
from src.utils.contracts_validator import ContractsValidator
from src.exceptions.contract_exceptions import (
    ContractContradictionException,
    ContractCreationContradictionException,
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
        contract_not_exist = self.find_contract_by_name(
            contract[contract_name]) is None
        if contract_not_exist is False:
            raise ContractAlreadyExistException(contract[contract_name])
        try:
            sub_contracts = contract[sub_contract_names]
            validator = ContractsValidator()
            for sub_contract in sub_contracts:
                sub_contract_dict = self.get_contract_with_its_dependencies(
                    sub_contract
                )
                sub_contract_object = Contract().from_json(sub_contract_dict)
                validator.add_contract_constraints(sub_contract_object)

            contract_object = Contract().from_json(contract)
            validator.add_contract_constraints(contract_object)
            self.collection.insert_one(contract)
        except ContractContradictionException as e:
            new_contract_name = contract[contract_name]
            raise ContractCreationContradictionException(
                new_contract_name, e.args)

    def fetch_all_contract_names(self):
        cursor = self.collection.find({},
                                      {mongo_id_field: 0, contract_name: 1})
        return [contract[contract_name] for contract in cursor]

    def find_contract_by_name(self, name):
        return self.collection.find_one(
            {contract_name: name},
            {mongo_id_field: 0})

    def get_contract_with_its_dependencies(self, name):
        contract_dict = self.find_contract_by_name(name)
        contract = Contract().from_json(contract_dict)
        subcontracts_list = contract.sub_contract_names.copy()
        while len(subcontracts_list) > 0:
            subcontract_dict = self. \
                find_contract_by_name(
                    subcontracts_list.pop(0))
            subcontract = Contract().from_json(subcontract_dict)
            subcontracts_list.extend(subcontract.sub_contract_names)
            contract.merge_contract_constraints(subcontract)

        return contract.to_json()
