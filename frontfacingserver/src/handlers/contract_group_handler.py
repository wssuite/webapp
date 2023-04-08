from src.handlers.base_handler import BaseHandler
from src.models.contract_group import ContractGroup
from src.exceptions.contract_exceptions import (
    ContractGroupNotExist,
    ContractGroupDeletionError,
)
from constants import contract_group_name, nurse_group_name, nurse_username


class ContractGroupHandler(BaseHandler):
    def __init__(self, mongo):
        super().__init__(mongo)

    def add(self, token, json):
        super().add(token, json)
        contract_group = ContractGroup().from_json(json)
        self.contract_group_insertion_verification(contract_group)
        self.contract_group_dao.insert_if_not_exist(contract_group.db_json())

    def update(self, token, json):
        super().update(token, json)
        contract_group = ContractGroup().from_json(json)
        self.contract_group_insertion_verification(contract_group)
        self.contract_group_dao.update(contract_group.db_json())

    def get_all(self, token, profile_name):
        super().get_all(token, profile_name)
        return self.contract_group_dao.fetch_all(profile_name)

    """To do verify that the contract group doesn't have any usage"""

    def delete(self, token, name, profile_name):
        super().delete(token, name, profile_name)
        usage = []
        usage.extend(
            [
                group[nurse_group_name]
                for group in self.nurse_group_dao.get_with_contract_groups(
                    [name], profile_name
                )
            ]
        )
        usage.extend(
            [
                nurse[nurse_username]
                for nurse in self.nurse_dao.get_with_contract_groups(
                    [name], profile_name
                )
            ]
        )
        if len(usage) > 0:
            raise ContractGroupDeletionError(name, usage)
        self.contract_group_dao.remove(name, profile_name)

    def get_all_names(self, token, profile_name):
        return [
            contract_group[contract_group_name]
            for contract_group in self.get_all(token, profile_name)
        ]

    def get_by_name(self, token, name, profile_name):
        super().get_by_name(token, name, profile_name)
        group_dict = self.contract_group_dao.find_by_name(name, profile_name)
        if group_dict is None:
            raise ContractGroupNotExist(name)
        return ContractGroup().from_json(group_dict).to_json()
