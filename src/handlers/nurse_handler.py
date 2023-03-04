from src.dao.contract_dao import ContractDao, Contract
from src.utils.contracts_validator import ContractsValidator
from src.dao.nurse_dao import NurseDao, Nurse
from src.dao.nurse_group_dao import NurseGroupDao
from src.handlers.user_handler import verify_token
from src.dao.user_dao import UserDao
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
    username, nurse_group_dao: NurseGroupDao
):
    groups = nurse_group_dao.get_with_nurses([username])
    ret = {}
    for group in groups:
        ret[group[nurse_group_name]] = group[nurse_group_contracts_list]
    return ret


class NurseHandler:
    def __init__(self, mongo):
        self.nurse_dao = NurseDao(mongo)
        self.contract_dao = ContractDao(mongo)
        self.nurse_group_dao = NurseGroupDao(mongo)
        self.user_dao = UserDao(mongo)

    def insertion_validations(self, token, json):
        verify_token(token, self.user_dao)
        nurse = Nurse().from_json(json)
        contract_validator = ContractsValidator()
        for contract_string in nurse.direct_contracts:
            contract_dict = self.contract_dao.find_by_name(contract_string)
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
        nurse, contract_validator = self.insertion_validations(token, json)
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
        nurse, contract_validator = self.insertion_validations(token, json)
        contract_by_nurse_group = (
            get_contracts_by_nurse_groups_including_nurse(
                nurse.username, self.nurse_group_dao
            )
        )
        for group in contract_by_nurse_group.keys():
            merged_contract = Contract()
            merged_contract.name = group
            for contract_name in contract_by_nurse_group[group]:
                contract_dict = self.contract_dao.find_by_name(contract_name)
                contract = Contract().from_json(contract_dict)
                merged_contract.merge_contract_constraints(contract)
            contract_validator.add_contract_constraints(merged_contract)

        before_update = self.get_by_username(token, nurse.username)
        nurse.id = before_update[nurse_id]
        self.nurse_dao.update(nurse.db_json())

    """
    Get the details of a nurse by username:
    Add the contracts that exist in the nurse groups to the list of inherited contracts
    """

    def get_by_username(self, token, nurse_to_be_found_username):
        verify_token(token, self.user_dao)
        nurse_dict = self.nurse_dao.find_by_username(
            nurse_to_be_found_username
        )
        if nurse_dict is None:
            raise NurseNotFound(nurse_to_be_found_username)
        nurse = Nurse().from_json(nurse_dict)
        contract_by_nurse_group = (
            get_contracts_by_nurse_groups_including_nurse(
                nurse.username, self.nurse_group_dao
            )
        )
        for group in contract_by_nurse_group.keys():
            nurse.inherited_contracts.extend(contract_by_nurse_group[group])
        return nurse.to_json()

    def get_all(self, token):
        verify_token(token, self.user_dao)
        all_nurses = self.nurse_dao.fetch_all()
        for nurse in all_nurses:
            contract_by_nurse_group = (
                get_contracts_by_nurse_groups_including_nurse(
                    nurse[nurse_username], self.nurse_group_dao
                )
            )
            inherited_contracts = []
            for group in contract_by_nurse_group.keys():
                inherited_contracts.extend(contract_by_nurse_group[group])
            nurse[nurse_inherited_contracts] = inherited_contracts
        return all_nurses

    def get_all_usernames(self, token):
        verify_token(token, self.user_dao)
        all_nurses = self.nurse_dao.fetch_all()
        return [nurse[nurse_username] for nurse in all_nurses]

    def delete(self, token, name):
        verify_token(token, self.user_dao)
        usage = self.nurse_group_dao.get_with_nurses([name])
        if len(usage) > 0:
            raise CannotDeleteNurse(name)
        self.nurse_dao.remove(name)
