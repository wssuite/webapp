from src.handlers.user_handler import verify_token
from src.dao.user_dao import UserDao
from src.dao.contract_dao import ContractDao, Contract
from src.dao.nurse_group_dao import NurseGroupDao
from src.dao.nurse_dao import NurseDao
from src.dao.shift_dao import ShiftDao
from src.dao.shift_type_dao import ShiftTypeDao
from src.dao.shift_group_dao import ShiftGroupDao
from src.dao.skill_dao import SkillDao
from src.exceptions.shift_exceptions import ShiftNotExist
from constants import (
    nurse_direct_contracts,
    nurse_group_contracts_list,
    nurse_name,
    contract_name,
)
from src.utils.contracts_validator import ContractsValidator
from src.exceptions.contract_exceptions import (
    CannotDeleteContract,
    ContractNotExist,
)


class ContractHandler:
    def __init__(self, mongo):
        self.user_dao = UserDao(mongo)
        self.contract_dao = ContractDao(mongo)
        self.nurse_dao = NurseDao(mongo)
        self.nurse_group_dao = NurseGroupDao(mongo)
        self.shift_dao = ShiftDao(mongo)
        self.shift_type_dao = ShiftTypeDao(mongo)
        self.shift_group_dao = ShiftGroupDao(mongo)
        self.skill_dao = SkillDao(mongo)

    """
    To add a contract we will perform a check on the token
    that is passed as a parameter.
    Then we must check that the shifts implied in the contract exist
    If all checks succeed we can safely add the new contract to the dao.
    The dao itself will check if there is another contract with the same
    name.
    """

    def add(self, token, json):
        contract = self.insertion_verification(token, json)
        self.contract_dao.insert_one(contract.db_json())
        self.skill_dao.insert_many(contract.skills)

    def verify_contract_shifts_exist(self, shifts, profile):
        not_exist_shifts = []
        for shift in shifts:
            shift_dict = self.shift_dao.find_by_name(shift, profile)
            shift_type = self.shift_type_dao.find_by_name(shift, profile)
            shift_group = self.shift_group_dao.find_by_name(shift, profile)
            exist = (
                shift_dict is not None
                or shift_group is not None
                or shift_type is not None
            )
            if exist is False:
                not_exist_shifts.append(shift)

        if len(not_exist_shifts) > 0:
            raise ShiftNotExist(shifts)

    def insertion_verification(self, token, json) -> Contract:
        verify_token(token, self.user_dao)
        contract = Contract().from_json(json)
        self.verify_contract_shifts_exist(contract.shifts, contract.profile)
        return contract

    """
    Before updating a contract we will perform the verifications that
    were done for the insertion operation.
    Additionally, we will verify that the modification that we are about
    to perform doesn't affect the combination of contracts that implied
    nurses/nurse groups have.
    """

    def update(self, token, json):
        contract = self.insertion_verification(token, json)
        nurses_with_contract = self.nurse_dao.get_with_contracts(
            [contract.name], contract.profile
        )
        nurse_groups = self.nurse_group_dao.get_with_contracts(
            [contract.name], contract.profile
        )
        self.contract_validation_with_other_contracts(
            nurses_with_contract, nurse_direct_contracts, contract
        )
        self.contract_validation_with_other_contracts(
            nurse_groups, nurse_group_contracts_list, contract
        )
        self.contract_dao.update(contract.db_json())
        self.skill_dao.insert_many(contract.skills)

    def contract_validation_with_other_contracts(self, array, tag, contract):
        for nurse in array:
            other_contracts_names = nurse.setdefault(tag, [])
            """Remove the contract that we are trying to modify"""
            other_contracts_names.remove(contract.name)
            """
            We suppose that other contracts don't have conflicts.
            This verification will be done however when inserting/updating
            a nurse or a nurse group.
            Consequently, we will perform a merge operation on the other
            contracts to reduce time complexity
            """
            verification_contract = Contract()
            verification_contract.name = f"{nurse[nurse_name]} other contracts"
            for other_contract_name in other_contracts_names:
                contract_dict = self.contract_dao.find_by_name(
                    other_contract_name, contract.profile
                )
                other_contract = Contract().from_json(contract_dict)
                verification_contract.merge_contract_constraints(
                    other_contract
                )

            validator = ContractsValidator()
            validator.add_contract_constraints(verification_contract)
            validator.add_contract_constraints(contract)

    """
    To delete a contract, it must not
    be used by any nurse nor any nurse groups
    """

    def delete(self, token, name, profile):
        verify_token(token, self.user_dao)
        usage = []
        usage.extend(self.nurse_dao.get_with_contracts([name], profile))
        usage.extend(self.nurse_group_dao.get_with_contracts([name], profile))
        if len(usage) > 0:
            raise CannotDeleteContract(name)
        self.contract_dao.remove(name, profile)

    def get_all(self, token, profile):
        verify_token(token, self.user_dao)
        return self.contract_dao.fetch_all(profile)

    def get_by_name(self, token, name, profile):
        verify_token(token, self.user_dao)
        contract_dict = self.contract_dao.find_by_name(name, profile)
        if contract_dict is None:
            raise ContractNotExist(name)
        return Contract().from_json(contract_dict).to_json()

    def get_all_names(self, token, profile):
        return [
            contract[contract_name]
            for contract in self.get_all(token, profile)
        ]
