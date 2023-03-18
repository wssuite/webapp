from unittest import TestCase
from src.models.contract import Contract, ContractMinMaxConstraint

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
    integer_constraint_value,
    constraint_weight,
    shift_constraint,
    min_constraint_value,
    max_constraint_value,
    min_constraint_weight,
    max_constraint_weight,
    unwanted_pattern_elements,
    pattern_element_shift,
    pattern_element_day,
    unwanted_skills,
    contract_skills,
    profile,
)
from test_constants import profile1


class TestContract(TestCase):
    def setUp(self) -> None:
        self.contract_dict = {
            contract_name: "FullTime",
            contract_constraints: [
                {
                    constraint_name: number_of_free_days_after_shift,
                    integer_constraint_value: "1.0",
                    constraint_weight: "hard",
                    shift_constraint: "Early",
                },
                {
                    constraint_name: unwanted_skills,
                    contract_skills: ["Nurse"],
                    constraint_weight: "hard",
                },
                {
                    constraint_name: total_weekends_in_four_weeks,
                    max_constraint_value: "5.0",
                    max_constraint_weight: "hard",
                    min_constraint_value: "1.0",
                    min_constraint_weight: "5.0",
                },
                {
                    constraint_name: min_max_num_assignments_in_four_weeks,
                    max_constraint_value: "5.0",
                    max_constraint_weight: "hard",
                    min_constraint_value: "1.0",
                    min_constraint_weight: "5.0",
                },
                {
                    constraint_name: min_max_consecutive_weekends,
                    max_constraint_value: "5.0",
                    max_constraint_weight: "hard",
                    min_constraint_value: "1.0",
                    min_constraint_weight: "5.0",
                },
                {
                    constraint_name: min_max_consecutive_shift_type,
                    max_constraint_value: "5.0",
                    max_constraint_weight: "hard",
                    min_constraint_value: "1.0",
                    min_constraint_weight: "5.0",
                    shift_constraint: "Early",
                },
                {
                    constraint_name: identical_shift_during_weekend,
                    constraint_weight: "hard",
                },
                {
                    constraint_name: complete_weekends,
                    constraint_weight: "hard",
                },
                {
                    constraint_name: unwanted_pattern,
                    unwanted_pattern_elements: [
                        {
                            pattern_element_shift: ["Late", "Early", "MidDay"],
                            pattern_element_day: [
                                "Monday",
                                "Wednesday",
                                "Friday",
                            ],
                        },
                        {
                            pattern_element_shift: ["Early"],
                            pattern_element_day: ["Tuesday"],
                        },
                    ],
                    constraint_weight: "hard",
                },
                {
                    constraint_name: alternative_shift,
                    shift_constraint: "Early",
                    constraint_weight: "hard",
                },
            ],
            profile: profile1,
        }

    def tearDown(self) -> None:
        pass

    def test_contract_object_is_initially_empty(self):
        contract = Contract()
        self.assertEqual("", contract.name)
        self.assertEqual(0, len(contract.constraints))

    def test_create_contract_from_json_contract_details_is_not_empty(self):
        contract = Contract().from_json(self.contract_dict)
        self.assertEqual(self.contract_dict, contract.to_json())
        self.assertEqual(["Early", "Late", "MidDay"], contract.shifts)
        self.assertEqual(["Nurse"], contract.skills)

    def test_two_merged_contract_constraints_are_added(self):
        contract = Contract().from_json(self.contract_dict)
        self.assertEqual(10, len(contract.constraints))
        added_constraint = ContractMinMaxConstraint().from_json(
            {
                constraint_name: min_max_num_assignments_in_four_weeks,
                max_constraint_value: "6.0",
                max_constraint_weight: "1.0",
                min_constraint_value: "1.0",
                min_constraint_weight: "5.0",
            }
        )

        another_contract = Contract()
        another_contract.constraints.append(added_constraint)
        contract.merge_contract_constraints(another_contract)
        modified_contract_dict = self.contract_dict.copy()

        modified_contract_dict[contract_constraints].append(
            added_constraint.to_json()
        )
        self.assertEqual(11, len(contract.constraints))
        self.assertEqual(modified_contract_dict, contract.to_json())

    def test_copy_contract_returns_another_object(self):
        contract = Contract().from_json(self.contract_dict)
        copy_contract = contract.copy()
        self.assertNotEqual(copy_contract, contract)
        self.assertEqual(copy_contract.db_json(), contract.db_json())

    def test_contract_creation_from_string(self):
        string = """name,FullTime,,,,,,,,
#constraint name ,,,,,,,,,
#,shift,value,weight,,,,,,
number of free days after shift,Early,1.0,hard
,,,,,,
#,skills,weight,,,,,,,
unwanted skills,Nurse,hard,,,,,,,
#,value,weight,,,,,,,
total number of working weekends in four weeks,1.0,5.0,5.0,hard,,,,,,,
#,min value,min weight,max value,max weight
,,,,,
minimum and maximum number of assignments in four weeks,1.0,5.0,5.0,hard,,,,,
#,min value,min weight,max value,max weight,,,,,
minimum and maximum of consecutive working weekends,1.0,5.0,5.0,hard,,,,,
#,shift,min value,min weight,max value,max weight,,,,
minimum and maximum of consecutive shift type,Early,1.0,5.0,5.0,hard,,,,
#,weight,,,,,,,,
identical shift types during weekend,hard,,,,,,,,
#,weight,,,,,,,,
complete weekends,hard,,,,,,,,
#,days,,,,,,,shift,weight
Unwanted patterns,Monday|Wednesday|Friday,Late|Early|MidDay,Tuesday,Early,hard
#,shift,weight,,,,,,,
unwanted shift,Early,hard,,,,,,,
,,,,,,,,,"""
        contract = Contract().read_contract(profile1, string)
        self.assertEqual(self.contract_dict, contract.to_json())

    def test_contract_creation_from_string_with_unknown_constraints(self):
        string = """name,FullTime,,,,,,,,
        #constraint name ,,,,,,,,,
        #,shift,value,weight,,,,,,
        some random constraint,,,,,
        number of free days after shift,Early,1.0,hard
,,,,,,"""
        expected = {
            contract_name: "FullTime",
            contract_constraints: [
                {
                    constraint_name: number_of_free_days_after_shift,
                    shift_constraint: "Early",
                    integer_constraint_value: "1.0",
                    constraint_weight: "hard",
                }
            ],
            profile: profile1,
        }
        contract = Contract().read_contract(profile1, string)
        self.assertEqual(expected, contract.to_json())
