from typing import Type, List

from src.models.jsonify import Jsonify
from src.models.constraints import (
    ContractConstraint,
    ContractBooleanConstraint,
    ContractMinMaxConstraint,
    ContractIntegerShiftConstraint,
    ContractMinMaxShiftConstraint,
    ContractUnwantedPatterns,
    ContractAlternativeShift,
    ContractUnwantedSkills,
)

from constants import (
    number_of_free_days_after_shift,
    total_weekends_in_four_weeks,
    min_max_consecutive_weekends,
    min_max_consecutive_shift_type,
    min_max_num_assignments_in_four_weeks,
    identical_shift_during_weekend,
    complete_weekends,
    alternative_shift,
    unwanted_pattern,
    constraint_name,
    contract_name,
    contract_constraints,
    contract_shifts,
    profile,
    unwanted_skills,
    contract_skills,
    bind_map,
)

from src.models.db_document import DBDocument
from src.models.string_reader import StringReader
from src.utils.import_util import sanitize_array, skip_line, Wrapper


class ContractConstraintCreator:
    def __init__(self):
        self.dict_contract_constraints: dict[str, Type[ContractConstraint]] = {
            number_of_free_days_after_shift: ContractIntegerShiftConstraint,
            total_weekends_in_four_weeks: ContractMinMaxConstraint,
            min_max_consecutive_shift_type: ContractMinMaxShiftConstraint,
            min_max_consecutive_weekends: ContractMinMaxConstraint,
            min_max_num_assignments_in_four_weeks: ContractMinMaxConstraint,
            identical_shift_during_weekend: ContractBooleanConstraint,
            complete_weekends: ContractBooleanConstraint,
            alternative_shift: ContractAlternativeShift,
            unwanted_pattern: ContractUnwantedPatterns,
            unwanted_skills: ContractUnwantedSkills,
        }

    def create_contact_constraint(self, data) -> ContractConstraint:
        return self.dict_contract_constraints[
            data[constraint_name]
        ]().from_json(data)

    def create_contract_constraint_from_string(self, line):
        tokens = line.split(",")
        tokens = sanitize_array(tokens)
        name = bind_map[tokens[0].lower()]
        return self.dict_contract_constraints[name]().read_line(line)


class Contract(Jsonify, DBDocument, StringReader):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.name = ""
        self.constraints: List[ContractConstraint] = []
        self.shifts = []
        self.profile = ""
        self.skills = []
        self.constraint_creator = ContractConstraintCreator()

    def from_json(self, data: dict):
        contract = Contract()

        contract.name = data.setdefault(contract_name, "")
        contract.profile = data.setdefault(profile, "")

        constraints = data.setdefault(contract_constraints, [])
        for constraint in constraints:
            new_constraint = self.constraint_creator.create_contact_constraint(
                constraint
            )
            contract.constraints.append(new_constraint)
            shifts = new_constraint.get_shift()
            contract.skills.extend(new_constraint.get_skills())
            for shift in shifts:
                if shift not in contract.shifts:
                    contract.shifts.append(shift)

        return contract

    def to_json(self):
        array_constraints = [
            constraint.to_json() for constraint in self.constraints
        ]
        return {
            contract_name: self.name,
            contract_constraints: array_constraints,
            profile: self.profile,
        }

    def db_json(self):
        basic_json = self.to_json()
        basic_json[contract_shifts] = self.shifts
        basic_json[contract_skills] = self.skills
        return basic_json

    def merge_contract_constraints(self, another_contract):
        self.constraints.extend(another_contract.constraints)

    def copy(self):
        return Contract().from_json(self.to_json())

    def read_contract(self, profile_name, contract_string):
        self.profile = profile_name
        lines = contract_string.split("\n")
        wrapper = Wrapper(lines[0].split(","))
        self.name = wrapper.get_by_index(1)
        self.constraints = []
        for i in range(1, len(lines)):
            if not skip_line(lines[i]):
                try:
                    constraint = self.read_line(lines[i])
                    self.constraints.append(constraint)
                except KeyError:
                    continue

        return self

    def read_line(self, line):
        return self.constraint_creator.create_contract_constraint_from_string(
            line
        )
