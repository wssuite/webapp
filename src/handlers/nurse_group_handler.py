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

    def verify_nurse_group_contracts(self, json):
        nurse_group = NurseGroup().from_json(json)
        nurse_group_merged_contract = Contract()
        nurse_group_merged_contract.name = f"{nurse_group.name} contract"
        contract_validator = ContractsValidator()
        for contract_name in nurse_group.contracts:
            contract_dict = self.contract_dao.find_by_name(
                contract_name, nurse_group.profile
            )
            if contract_dict is None:
                raise ContractNotExist(contract_name)
            contract = Contract().from_json(contract_dict)
            contract_validator.add_contract_constraints(contract)
            nurse_group_merged_contract.merge_contract_constraints(contract)
        return nurse_group, nurse_group_merged_contract

    def verify_contract_groups(self, nurse_group: NurseGroup):
        for contract_group in nurse_group.contract_groups:
            exist = self.contract_group_dao.exist(
                contract_group, nurse_group.profile
            )
            if exist is False:
                raise ContractGroupNotExist(contract_group)

    def verify_group_combination_with_nurses(
        self, nurse_group, nurse_group_merged_contract: Contract
    ):
        for nurse_name in nurse_group.nurses:
            nurse_group_contract_copy = nurse_group_merged_contract.copy()
            nurse_contract_validator = ContractsValidator()
            nurse_contract_validator.add_contract_constraints(
                nurse_group_contract_copy
            )
            nurse_dict = self.nurse_dao.find_by_username(
                nurse_name, nurse_group.profile
            )
            if nurse_dict is None:
                raise NurseNotFound(nurse_name)

    def verify_nurse_group_is_valid(self, json):
        (
            nurse_group,
            nurse_group_merged_contract,
        ) = self.verify_nurse_group_contracts(json)
        self.verify_group_combination_with_nurses(
            nurse_group, nurse_group_merged_contract
        )
        self.verify_contract_groups(nurse_group)
        return nurse_group

    def add(self, token, json):
        super().add(token, json)
        nurse_group = self.verify_nurse_group_is_valid(json)
        self.nurse_group_dao.insert_one_if_not_exist(nurse_group.db_json())

    def update(self, token, json):
        super().update(token, json)
        nurse_group = self.verify_nurse_group_is_valid(json)
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
