from src.dao.abstract_dao import AbstractDao
from pymongo.collection import Collection
from constants import (
    contract_name,
    mongo_id_field,
    mongo_set_operation,
    mongo_all_operation,
    contract_shifts,
    profile,
    contract_skills,
)
from src.exceptions.contract_exceptions import (
    ContractAlreadyExistException,
)
from src.models.contract import Contract


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
        exist = self.exist(contract[contract_name], contract[profile])
        if exist is True:
            raise ContractAlreadyExistException(contract[contract_name])
        self.collection.insert_one(contract)

    def fetch_all(self, profile_name):
        cursor = self.collection.find(
            {profile: profile_name}, {mongo_id_field: 0}
        )
        return get_contracts_from_cursor(cursor)

    def find_by_name(self, name, profile_name):
        return self.collection.find_one(
            {contract_name: name, profile: profile_name},
            {mongo_id_field: 0, contract_shifts: 0, contract_skills: 0},
        )

    def exist(self, name, profile_name):
        contract = self.find_by_name(name, profile_name)
        return contract is not None

    def update(self, contract: dict):
        self.collection.find_one_and_update(
            {
                contract_name: contract[contract_name],
                profile: contract[profile],
            },
            {mongo_set_operation: contract},
        )

    def remove(self, name, profile_name):
        self.collection.find_one_and_delete(
            {contract_name: name, profile: profile_name}
        )

    def get_including_shifts(self, shifts_array, profile_name):
        contracts = self.collection.find(
            {
                contract_shifts: {mongo_all_operation: shifts_array},
                profile: profile_name,
            }
        )
        return get_contracts_from_cursor(contracts)

    def get_including_skills(self, skills_array, profile_name):
        contracts = self.collection.find(
            {
                contract_skills: {mongo_all_operation: skills_array},
                profile: profile_name,
            }
        )
        return get_contracts_from_cursor(contracts)

    def delete_all(self, profile_name):
        self.collection.delete_many({profile: profile_name})

    def duplicate(self, profile1, profile2):
        contracts = self.fetch_all(profile1)
        for contract in contracts:
            contract_object = Contract().from_json(contract)
            contract_object.profile = profile2
            self.collection.insert_one(contract_object.db_json())
