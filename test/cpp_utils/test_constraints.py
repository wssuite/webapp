from unittest import TestCase
from constants import (
    constraint_name,
    integer_constraint_value,
    constraint_weight,
    shift_constraint,
    unwanted_pattern_elements,
    number_of_free_days_after_shift,
    total_weekends_in_four_weeks,
    pattern_element_day,
    pattern_element_shift,
    unwanted_pattern, min_constraint_value, max_constraint_value, min_constraint_weight, max_constraint_weight,
    contract_skills,
)

from src.models.constraints import (
    ContractIntegerConstraint,
    ContractIntegerShiftConstraint,
    ContractUnwantedPatterns, ContractMinMaxConstraint, ContractMinMaxShiftConstraint, ContractBooleanConstraint,
    ContractAlternativeShift, ContractUnwantedSkills,
)


class TestConstraints(TestCase):
    def setUp(self) -> None:
        pass

    def tearDown(self) -> None:
        pass

    def test_contract_integer_constraint_creation(self):
        integer_constraint_dict1 = {
            constraint_name: total_weekends_in_four_weeks,
            integer_constraint_value: "1.0",
            constraint_weight: "hard",
        }

        integer_constraint_dict2 = {
            constraint_name: total_weekends_in_four_weeks,
            integer_constraint_value: "10.0",
            constraint_weight: "hard",
        }

        constraint1 = ContractIntegerConstraint().from_json(
            integer_constraint_dict1
        )
        constraint2 = ContractIntegerConstraint().from_json(
            integer_constraint_dict2
        )

        self.assertEqual("1.0", constraint1.value)
        self.assertEqual("10.0", constraint2.value)
        self.assertEqual(total_weekends_in_four_weeks, constraint1.repr())
        self.assertEqual(integer_constraint_dict2, constraint2.to_json())

    def test_contract_integer_shift_constraint_creation(self):
        integer_shift_constraint_dict1 = {
            constraint_name: number_of_free_days_after_shift,
            integer_constraint_value: "1.0",
            constraint_weight: "hard",
            shift_constraint: "Early",
        }

        constraint1 = ContractIntegerShiftConstraint().from_json(
            integer_shift_constraint_dict1
        )

        self.assertEqual("1.0", constraint1.value)
        self.assertEqual(
            f"{number_of_free_days_after_shift}," f"Early", constraint1.repr()
        )

    def test_contract_unwanted_pattern_creation(self):
        unwanted_pattern_constraint_dict = {
            constraint_name: unwanted_pattern,
            unwanted_pattern_elements: [
                {
                    pattern_element_day: ["Monday"],
                    pattern_element_shift: ["Early"],
                },
                {
                    pattern_element_day: ["Thursday"],
                    pattern_element_shift: ["Late"],
                },
            ],
            constraint_weight: "hard",
        }

        constraint = ContractUnwantedPatterns().from_json(
            unwanted_pattern_constraint_dict
        )

        self.assertEqual(2, len(constraint.pattern_elements))
        self.assertEqual(
            unwanted_pattern_constraint_dict, constraint.to_json()
        )

    def test_create_integer_constraint_from_string_create_structure(self):
        string = "total number of working weekends in four weeks,2,1.5,,,,,,,"
        expected_constraint = {
            constraint_name: "total number of working weekends in four weeks",
            integer_constraint_value: "2",
            constraint_weight: "1.5"
        }
        constraint = ContractIntegerConstraint().read_line(string)
        self.assertEqual(expected_constraint, constraint)

    def test_create_shift_integer_constraint_from_string_create_structure(self):
        string = "number of free days after shift,late,2,10,,,,,,"
        expected_constraint = {
            constraint_name: "number of free days after shift",
            shift_constraint: "late",
            integer_constraint_value: "2",
            constraint_weight: "10"
        }
        constraint = ContractIntegerShiftConstraint().read_line(string)
        self.assertEqual(expected_constraint, constraint)

    def test_create_min_max_constraint_from_string_create_structure(self):
        string = "minimum and maximum number of assignments in four weeks,20,6,35,10,,,,,"
        expected_constraint = {
            constraint_name: "minimum and maximum number of assignments in four weeks",
            min_constraint_value: "20",
            max_constraint_value: '35',
            min_constraint_weight: '6',
            max_constraint_weight: '10'
        }
        constraint = ContractMinMaxConstraint().read_line(string)
        self.assertEqual(expected_constraint, constraint)

    def test_create_min_max_shift_constraint_from_string_create_structure(self):
        string = "minimum and maximum of consecutive shift type,late,2,hard,5,2,,,,"
        expected_constraint = {
            constraint_name: "minimum and maximum of consecutive shift type",
            shift_constraint: "late",
            min_constraint_value: "2",
            max_constraint_value: '5',
            min_constraint_weight: 'hard',
            max_constraint_weight: '2'
        }
        constraint = ContractMinMaxShiftConstraint().read_line(string)
        self.assertEqual(expected_constraint, constraint)

    def test_create_boolean_constraint_create_structure(self):
        string = "identical shift types during weekend,5,,,,,,,,"
        expected_constraint = {
            constraint_name: "identical shift types during weekend",
            constraint_weight: "5"
        }
        constraint = ContractBooleanConstraint().read_line(string)
        self.assertEqual(expected_constraint, constraint)

    def test_create_alternative_constraint_create_structure(self):
        string = "unwanted shift,Late,-5,,,,,,,"
        expected_constraint = {
            constraint_name: 'unwanted shift',
            shift_constraint: "Late",
            constraint_weight: "-5"
        }
        constraint = ContractAlternativeShift().read_line(string)
        self.assertEqual(expected_constraint, constraint)

    def test_create_unwanted_skills_from_string_create_structure(self):
        string = "unwanted skills,HeadNurse,Nurse,0.8,,,,,,"
        expected_constraint = {
            constraint_name: "unwanted skills",
            contract_skills: [
                "HeadNurse",
                "Nurse",
            ],
            constraint_weight: "0.8"
        }
        constraint = ContractUnwantedSkills().read_line(string)
        self.assertEqual(expected_constraint, constraint)

    def test_create_unwanted_shifts_from_string_create_structure(self):
        string = "Unwanted patterns,Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday,Early,hard,,"
        expected_constraint = {
            constraint_name: "Unwanted patterns",
            unwanted_pattern_elements: [
                {
                    pattern_element_day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    pattern_element_shift: ["Early"],
                }
            ],
            constraint_weight: 'hard'
        }
        constraint = ContractUnwantedPatterns().read_line(string)
        self.assertEqual(expected_constraint, constraint)

    def test_create_unwanted_shifts_from_string_with_two_patterns_create_structure(self):
        string = "Unwanted patterns,Monday|Tuesday,Early,Thursday|Friday,Late,hard,,"
        expected_constraint = {
            constraint_name: "Unwanted patterns",
            unwanted_pattern_elements: [
                {
                    pattern_element_day: ["Monday", "Tuesday"],
                    pattern_element_shift: ["Early"],
                },
                {
                    pattern_element_day: ["Thursday", "Friday"],
                    pattern_element_shift: ["Late"],
                }
            ],
            constraint_weight: 'hard'
        }
        constraint = ContractUnwantedPatterns().read_line(string)
        self.assertEqual(expected_constraint, constraint)