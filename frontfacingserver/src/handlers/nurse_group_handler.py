from src.dao.contract_dao import Contract
from src.handlers.base_handler import BaseHandler
from src.models.nurse_group import NurseGroup
from src.exceptions.contract_exceptions import (
    ContractNotExist,
    ContractGroupNotExist,
)
from src.utils.contracts_validator import ContractsValidator
from src.exceptions.nurse_exceptions import NurseNotFound, NurseGroupNotFound
from constants import nurse_group_name

"""
Before inserting or updating a nurse group:
1- Verify that the contracts that in the group don't contradict each other
2- For each nurse in the nurse group verify that their direct contracts nor
the contracts coming from other groups contradict the contracts in this group
"""


class NurseGroupHandler(BaseHandler):
    def __init__(self, mongo):
        super().__init__(mongo)

    def add(self, token, json):
        super().add(token, json)
        nurse_group = NurseGroup().from_json(json)
        self.verify_name_is_valid(nurse_group.name)
        self.verify_nurse_group_is_valid(nurse_group)
        self.nurse_group_dao.insert_one_if_not_exist(nurse_group.db_json())

    def update(self, token, json):
        super().update(token, json)
        nurse_group = NurseGroup().from_json(json)
        self.verify_nurse_group_is_valid(nurse_group)
        self.nurse_group_dao.update(nurse_group.db_json())

    def get_all(self, token, profile):
        super().get_all(token, profile)
        return self.nurse_group_dao.fetch_all(profile)

    def get_all_names(self, token, profile):
        return [
            nurse_group[nurse_group_name]
            for nurse_group in self.get_all(token, profile)
        ]

    def delete(self, token, name, profile):
        super().delete(token, name, profile)
        self.nurse_group_dao.remove(name, profile)

    def get_by_name(self, token, name, profile):
        super().get_by_name(token, name, profile)
        nurse_group_dict = self.nurse_group_dao.find_by_name(name, profile)
        if nurse_group_dict is None:
            raise NurseGroupNotFound(name)
        nurse_group = NurseGroup().from_json(nurse_group_dict)
        return nurse_group.to_json()
