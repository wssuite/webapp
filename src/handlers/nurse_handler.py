from src.dao.contract_dao import ContractDao, Contract
from src.utils.contracts_validator import ContractsValidator
from src.dao.nurse_dao import NurseDao, Nurse
from src.dao.nurse_group_dao import NurseGroupDao
from src.handlers.base_handler import BaseHandler
from src.exceptions.contract_exceptions import ContractNotExist
from src.exceptions.nurse_exceptions import NurseNotFound, CannotDeleteNurse
from constants import (
    nurse_group_name,
    nurse_group_contracts_list,
    nurse_username,
    nurse_inherited_contracts,
    nurse_id,
)


def get_contracts_by_nurse_groups_including_nurse(
    username, nurse_group_dao: NurseGroupDao, profile
):
    groups = nurse_group_dao.get_with_nurses([username], profile)
    ret = {}
    for group in groups:
        ret[group[nurse_group_name]] = group[nurse_group_contracts_list]
    return ret


class NurseHandler(BaseHandler):
    def __init__(self, mongo):
        super().__init__(mongo)
        self.nurse_dao = NurseDao(mongo)
        self.contract_dao = ContractDao(mongo)
        self.nurse_group_dao = NurseGroupDao(mongo)

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
        return str(inserted_id.inserted_id)

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
        contract_by_nurse_group = (
            get_contracts_by_nurse_groups_including_nurse(
                nurse.username, self.nurse_group_dao, nurse.profile
            )
        )
        for group in contract_by_nurse_group.keys():
            nurse.inherited_contracts.extend(contract_by_nurse_group[group])
        return nurse.to_json()

    def get_all(self, token, profile):
        super().get_all(token, profile)
        all_nurses = self.nurse_dao.fetch_all(profile)
        for nurse in all_nurses:
            contract_by_nurse_group = (
                get_contracts_by_nurse_groups_including_nurse(
                    nurse[nurse_username], self.nurse_group_dao, profile
                )
            )
            inherited_contracts = []
            for group in contract_by_nurse_group.keys():
                inherited_contracts.extend(contract_by_nurse_group[group])
            nurse[nurse_inherited_contracts] = inherited_contracts
        return all_nurses

    def get_all_usernames(self, token, profile):
        self.verify_token(token)
        all_nurses = self.nurse_dao.fetch_all(profile)
        return [nurse[nurse_username] for nurse in all_nurses]

    def delete(self, token, name, profile):
        super().delete(token, name, profile)
        usage = self.nurse_group_dao.get_with_nurses([name], profile)
        if len(usage) > 0:
            raise CannotDeleteNurse(name)
        self.nurse_dao.remove(name, profile)
