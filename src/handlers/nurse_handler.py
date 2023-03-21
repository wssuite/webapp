from src.dao.contract_dao import Contract
from src.utils.contracts_validator import ContractsValidator
from src.dao.nurse_dao import Nurse
from src.handlers.base_handler import BaseHandler
from src.exceptions.contract_exceptions import (
    ContractNotExist,
    ContractGroupNotExist,
)
from src.exceptions.nurse_exceptions import NurseNotFound, CannotDeleteNurse
from constants import (
    nurse_username,
    nurse_id,
    nurse_group_name,
)


class NurseHandler(BaseHandler):
    def __init__(self, mongo):
        super().__init__(mongo)

    def insertion_validations(self, json):
        nurse = Nurse().from_json(json)
        contract_validator = ContractsValidator()
        for contract_string in nurse.direct_contracts:
            contract_dict = self.contract_dao.find_by_name(
                contract_string, nurse.profile
            )
            if contract_dict is None:
                raise ContractNotExist(contract_string)
            contract = Contract().from_json(contract_dict)
            contract_validator.add_contract_constraints(contract)

        for contract_group in nurse.contract_groups:
            exist = self.contract_group_dao.exist(
                contract_group, nurse.profile
            )
            if exist is False:
                raise ContractGroupNotExist(contract_group)

        return nurse, contract_validator

    """
    Before adding a nurse we need to verify:
    1- Contracts of the nurse exist
    2- The contracts combination doesn't cause a problem
    """

    def add(self, token, json):
        super().add(token, json)
        nurse, contract_validator = self.insertion_validations(json)
        inserted_id = self.nurse_dao.insert_one(nurse.db_json())
        return inserted_id

    """
    Before updating a nurse we need to verify:
    1- Contracts according to the update exist
    2- The new contract combination doesn't cause a problem
    3- The combination of new contracts work well with the
    nurse's groups contracts
    """

    def update(self, token, json):
        super().update(token, json)
        nurse, contract_validator = self.insertion_validations(json)
        before_update = self.get_by_username(
            token, nurse.username, nurse.profile
        )
        nurse.id = before_update[nurse_id]
        self.nurse_dao.update(nurse.db_json())

    """
    Get the details of a nurse by username:
    Add the contracts that exist in the nurse groups
    to the list of inherited contracts
    """

    def get_by_username(self, token, nurse_to_be_found_username, profile):
        self.verify_token(token)
        nurse_dict = self.nurse_dao.find_by_username(
            nurse_to_be_found_username, profile
        )
        if nurse_dict is None:
            raise NurseNotFound(nurse_to_be_found_username)
        nurse = Nurse().from_json(nurse_dict)
        return nurse.to_json()

    def get_all(self, token, profile):
        super().get_all(token, profile)
        all_nurses = self.nurse_dao.fetch_all(profile)
        return all_nurses

    def get_all_usernames(self, token, profile):
        self.verify_token(token)
        all_nurses = self.nurse_dao.fetch_all(profile)
        return [nurse[nurse_username] for nurse in all_nurses]

    def delete(self, token, name, profile):
        super().delete(token, name, profile)
        usage = [
            nurse_group[nurse_group_name]
            for nurse_group in self.nurse_group_dao.get_with_nurses(
                [name], profile
            )
        ]
        if len(usage) > 0:
            raise CannotDeleteNurse(name, usage)
        self.nurse_dao.remove(name, profile)
