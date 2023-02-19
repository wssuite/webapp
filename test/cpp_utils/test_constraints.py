from unittest import TestCase
from constants import constraint_name, \
    integer_constraint_value, constraint_weight, \
    shift_constraint, unwanted_pattern_elements, \
    number_of_free_days_after_shift, total_weekends_in_four_weeks, \
    pattern_element_day, pattern_element_shift, unwanted_pattern

from src.cpp_utils.constraints import ContractIntegerConstraint, \
    ContractIntegerShiftConstraint, ContractUnwantedPatterns


class TestConstraints(TestCase):
    def setUp(self) -> None:
        pass

    def tearDown(self) -> None:
        pass

    def test_contract_integer_constraint_creation(self):
        integer_constraint_dict1 = {
            constraint_name: total_weekends_in_four_weeks,
            integer_constraint_value: "1.0",
            constraint_weight: "hard"

        }

        integer_constraint_dict2 = {
            constraint_name: total_weekends_in_four_weeks,
            integer_constraint_value: "10.0",
            constraint_weight: "hard"
        }

        constraint1 = ContractIntegerConstraint().from_json(
            integer_constraint_dict1)
        constraint2 = ContractIntegerConstraint().from_json(
            integer_constraint_dict2)

        self.assertEqual("1.0", constraint1.value)
        self.assertEqual("10.0", constraint2.value)
        self.assertEqual(total_weekends_in_four_weeks,
                         constraint1.repr())
        self.assertEqual(integer_constraint_dict2,
                         constraint2.to_json())

    def test_contract_integer_shift_constraint_creation(self):
        integer_shift_constraint_dict1 = {
            constraint_name: number_of_free_days_after_shift,
            integer_constraint_value: "1.0",
            constraint_weight: "hard",
            shift_constraint: "Early"

        }

        constraint1 = ContractIntegerShiftConstraint().\
            from_json(integer_shift_constraint_dict1)

        self.assertEqual("1.0", constraint1.value)
        self.assertEqual(f"{number_of_free_days_after_shift},"
                         f"Early", constraint1.repr())

    def test_contract_unwanted_pattern_creation(self):
        unwanted_pattern_constraint_dict = {
            constraint_name: unwanted_pattern,
            unwanted_pattern_elements: [
                {
                    pattern_element_day: "Monday",
                    pattern_element_shift: "Early"
                },
                {
                    pattern_element_day: "Thursday",
                    pattern_element_shift: "Late"
                }
            ],
            constraint_weight: "hard"
        }

        constraint = ContractUnwantedPatterns().from_json(
            unwanted_pattern_constraint_dict)

        self.assertEqual(2, len(constraint.pattern_elements))
        self.assertEqual(unwanted_pattern_constraint_dict,
                         constraint.to_json())
