import re

from src.exceptions.project_base_exception import ProjectBaseException
from src.exceptions.nurse_exceptions import NurseNotFound
from src.models.nurse_group import NurseGroup
from src.exceptions.contract_exceptions import (
    ContractNotExist,
    ContractGroupNotExist,
)
from src.models.contract import Contract
from src.dao.user_dao import UserDao
from constants import (
    empty_token,
    profile_creator,
    profile_access,
    user_username,
    profile,
)
from src.exceptions.user_exceptions import LoginRequired, TokenInvalid
from src.dao.contract_dao import ContractDao
from src.dao.nurse_dao import NurseDao
from src.dao.nurse_group_dao import NurseGroupDao
from src.dao.shift_dao import ShiftDao
from src.dao.shift_type_dao import ShiftTypeDao
from src.dao.shift_group_dao import ShiftGroupDao
from src.dao.skill_dao import SkillDao
from src.dao.profile_dao import ProfileDao
from src.dao.contract_group_dao import ContractGroupDao
from src.dao.solution_dao import SolutionDao
from src.exceptions.user_exceptions import ProfileAccessException
from src.exceptions.shift_exceptions import ShiftNotExist
from src.exceptions.skill_exceptions import SkillNotExist
from src.utils.contracts_validator import ContractsValidator


class BaseHandler:
    def __init__(self, mongo):
        self.user_dao = UserDao(mongo)
        self.contract_dao = ContractDao(mongo)
        self.nurse_dao = NurseDao(mongo)
        self.nurse_group_dao = NurseGroupDao(mongo)
        self.shift_dao = ShiftDao(mongo)
        self.shift_type_dao = ShiftTypeDao(mongo)
        self.shift_group_dao = ShiftGroupDao(mongo)
        self.skill_dao = SkillDao(mongo)
        self.profile_dao = ProfileDao(mongo)
        self.contract_group_dao = ContractGroupDao(mongo)
        self.solution_dao = SolutionDao(mongo)

    def verify_token(self, token):
        if token == empty_token:
            raise LoginRequired()
        user_dict = self.user_dao.find_by_token(token)
        if user_dict is None:
            raise TokenInvalid()
        return user_dict

    def verify_profile_creator_access(self, token, name):
        user = self.verify_token(token)
        profile_dict = self.profile_dao.find_by_name(name)
        if user[user_username] != profile_dict[profile_creator]:
            raise ProfileAccessException(
                user[user_username], profile_dict[profile_creator]
            )
        return profile_dict

    def verify_profile_accessors_access(self, token, name):
        user = self.verify_token(token)
        profile_dict = self.profile_dao.find_by_name(name)
        if user[user_username] not in profile_dict[profile_access]:
            raise ProfileAccessException(
                user[user_username], profile_dict[profile_access]
            )
        return profile_dict

    """
    The following methods are used by handlers which treat a profile element
    eg: ContractHandler
    """

    def add(self, token, json):
        self.verify_profile_accessors_access(token, json[profile])

    def update(self, token, json):
        self.verify_profile_accessors_access(token, json[profile])

    def delete(self, token, name, profile_name):
        self.verify_profile_accessors_access(token, profile_name)

    def get_all(self, token, profile_name):
        self.verify_profile_accessors_access(token, profile_name)

    def get_by_name(self, token, name, profile_name):
        self.verify_profile_accessors_access(token, profile_name)

    def verify_shifts_exist(self, shifts, profile_name):
        not_exist_shifts = []
        for shift in shifts:
            exist = self.shift_dao.exist(shift, profile_name)
            if exist is False:
                not_exist_shifts.append(shift)
        if len(not_exist_shifts) > 0:
            raise ShiftNotExist(not_exist_shifts)

    def verify_shift_shift_types_exist(self, shifts, profile_name):
        not_exist_shifts = []
        for shift in shifts:
            exist_shift = self.shift_dao.exist(shift, profile_name)
            exist_shift_type = self.shift_type_dao.exist(shift, profile_name)
            if exist_shift is False and exist_shift_type is False:
                not_exist_shifts.append(shift)
        if len(not_exist_shifts) > 0:
            raise ShiftNotExist(not not_exist_shifts)

    def _shift_group_verifications(self, shift_group):
        self.verify_name_is_valid(shift_group.name)
        shifts = []
        shifts.extend(shift_group.shifts)
        shifts.extend(shift_group.shift_types)
        self.verify_shift_shift_types_exist(shifts, shift_group.profile)

    def _shift_type_verifications(self, shift_type):
        self.verify_name_is_valid(shift_type.name)
        self.verify_shifts_exist(shift_type.shifts, shift_type.profile)

    def verify_contract_shifts_exist(self, shifts, profile_name):
        not_exist_shifts = []
        for shift in shifts:
            shift_dict = self.shift_dao.find_by_name(shift, profile_name)
            shift_type = self.shift_type_dao.find_by_name(shift, profile_name)
            shift_group = self.shift_group_dao.find_by_name(
                shift, profile_name
            )
            exist = (
                shift_dict is not None
                or shift_group is not None
                or shift_type is not None
            )
            if exist is False:
                not_exist_shifts.append(shift)

        if len(not_exist_shifts) > 0:
            raise ShiftNotExist(not_exist_shifts)

    def verify_contract_skills_exist(self, skills, profile_name):
        non_existent_skills = []
        for skill in skills:
            exist = self.skill_dao.exist(skill, profile_name)
            if exist is False:
                non_existent_skills.append(skill)

        if len(non_existent_skills) > 0:
            raise SkillNotExist(non_existent_skills)

    def contract_insertion_verification(self, contract):
        self.verify_name_is_valid(contract.name)
        self.verify_contract_shifts_exist(contract.shifts, contract.profile)
        self.verify_contract_skills_exist(contract.skills, contract.profile)

    def contract_group_insertion_verification(self, contract_group):
        self.verify_name_is_valid(contract_group.name)
        validator = ContractsValidator()
        for contract in contract_group.contracts:
            contract_dict = self.contract_dao.find_by_name(
                contract, contract_group.profile
            )
            if contract_dict is None:
                raise ContractNotExist(contract)
            contract_object = Contract().from_json(contract_dict)
            validator.add_contract_constraints(contract_object)

    def nurse_insertion_validations(self, nurse):
        self.verify_name_is_valid(nurse.username)
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

        return contract_validator

    def verify_nurse_group_contracts(self, nurse_group):
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
        return nurse_group_merged_contract

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

    def verify_nurse_group_is_valid(self, nurse_group):
        self.verify_name_is_valid(nurse_group.name)
        nurse_group_merged_contract = self.verify_nurse_group_contracts(
            nurse_group
        )
        self.verify_group_combination_with_nurses(
            nurse_group, nurse_group_merged_contract
        )
        self.verify_contract_groups(nurse_group)

    @staticmethod
    def verify_name_is_valid(name):
        pattern = r"[^a-zA-Z0-9_\-\s]+"
        match = re.match(pattern, name)
        if match is not None:
            raise ProjectBaseException(
                "The special characters like @ and ! are not supported"
            )

    @staticmethod
    def verify_profile_name_not_have_whitespace(name: str):
        if name.__contains__(" "):
            raise ProjectBaseException("The profile must not have whitespaces")
