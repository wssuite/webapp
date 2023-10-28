from pymongo.collection import Collection
from src.exceptions.contract_exceptions import ContractGroupAlreadyExist
from constants import profile, contract_group_name
from src.models.contract_group import ContractGroup
from src.dao.abstract_dao import AbstractDao
from constants import (
    mongo_set_operation,
    mongo_id_field,
    mongo_all_operation,
    contract_group_contracts_list,
)


def get_contract_groups_from_cursor(cursor):
    contract_groups = []
    for group_dict in cursor:
        contract_group = ContractGroup().from_json(group_dict)
        contract_groups.append(contract_group.to_json())
    return contract_groups


class ContractGroupDao(AbstractDao):
    def __init__(self, mongo):
        super().__init__(mongo)
        self.collection: Collection = self.db.contract_group

    def insert_if_not_exist(self, json):
        exist = self.exist(json[contract_group_name], json[profile])
        if exist is True:
            raise ContractGroupAlreadyExist(json[contract_group_name])
        self.collection.insert_one(json)

    def exist(self, name, profile_name):
        return self.find_by_name(name, profile_name) is not None

    def find_by_name(self, name, profile_name):
        return self.collection.find_one(
            {contract_group_name: name, profile: profile_name},
            {mongo_id_field: 0},
        )

    def update(self, json: dict):
        self.collection.find_one_and_update(
            {
                contract_group_name: json[contract_group_name],
                profile: json[profile],
            },
            {mongo_set_operation: json},
        )

    def remove(self, name, profile_name):
        self.collection.find_one_and_delete(
            {contract_group_name: name, profile: profile_name}
        )

    def delete_all(self, profile_name):
        self.collection.delete_many({profile: profile_name})

    def fetch_all(self, profile_name):
        cursor = self.collection.find({profile: profile_name})
        return get_contract_groups_from_cursor(cursor)

    def duplicate(self, profile1, profile2):
        contract_groups = self.fetch_all(profile1)
        for contract_group in contract_groups:
            contract_group_object = ContractGroup().from_json(contract_group)
            contract_group_object.profile = profile2
            self.collection.insert_one(contract_group_object.db_json())

    def get_including_contracts(self, contracts, profile_name):
        cursor = self.collection.find(
            {
                contract_group_contracts_list: {
                    mongo_all_operation: contracts
                },
                profile: profile_name,
            }
        )
        return get_contract_groups_from_cursor(cursor)
