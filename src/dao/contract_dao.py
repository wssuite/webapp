from src.dao.abstract_dao import AbstractDao
from src.cpp_utils.contract import Contract
from pymongo.collection import Collection
from constants import contract_name, sub_contract_limit, \
    mongo_id_field, sub_contract_names
from src.utils.contracts_validator import ContractsValidator
from src.exceptions.contract_exceptions import (
    ContractContradictionException,
    ContractCreationContradictionException,
    ContractAlreadyExistException,
    ContractTreeTooLarge
)
import json


def get_subcontract_limit():
    with open("config.json") as file:
        data = json.load(file)

    return data[sub_contract_limit]


class ContractDao(AbstractDao):
    def __init__(self, mongo):
        super().__init__(mongo)
        self.collection: Collection = self.db.contracts

        self.sub_contract_limit = get_subcontract_limit()

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

    """
    If there are subcontracts to the subcontracts the counter
    increments from two.
    The subcontract_counter variable ensures that we don't go
    past 20 in the contract tree.
    This limitation will reduce the risk of over using the
    stack when updating a contract that has indirect dependencies.
    """

    def get_contract_with_its_dependencies(self, name):
        contract_dict = self.find_contract_by_name(name)
        contract = Contract().from_json(contract_dict)
        subcontracts_tuples_list = [(sub_contract, 2)
                                    for sub_contract in
                                    contract.sub_contract_names.copy()]

        while len(subcontracts_tuples_list) > 0:
            subcontract_tuple = subcontracts_tuples_list.pop(0)
            subcontract_dict = (self.
                                find_contract_by_name(subcontract_tuple[0]))
            subcontract = Contract().from_json(subcontract_dict)
            subcontract_counter = subcontract_tuple[1]

            if subcontract_counter < self.sub_contract_limit:
                new_subcontract_tuple_list = [(indirect_contract,
                                               subcontract_counter + 1)
                                              for indirect_contract in
                                              subcontract.sub_contract_names]
                subcontracts_tuples_list.extend(new_subcontract_tuple_list)
            else:
                raise ContractTreeTooLarge()

            contract.merge_contract_constraints(subcontract)

        return contract.to_json()
