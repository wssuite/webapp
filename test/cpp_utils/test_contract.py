from unittest import TestCase
from src.cpp_utils.contract import Contract

from constants import number_of_free_days_after_shift, \
    total_weekends_in_four_weeks, min_max_consecutive_weekends, \
    min_max_consecutive_shift_type, min_max_num_assignments_in_four_weeks, \
    identical_shift_during_weekend, complete_weekends, alternative_shift, \
    unwanted_pattern, constraint_name, sub_contract_names, contract_name, \
    contract_constraints, contract_skills, integer_constraint_value,\
    constraint_weight, shift_constraint, min_constraint_value, \
    max_constraint_value, min_constraint_weight, \
    max_constraint_weight, unwanted_pattern_elements, \
    pattern_element_shift, pattern_element_day


class TestContract(TestCase):
    def setUp(self) -> None:
        pass

    def tearDown(self) -> None:
        pass

    def test_contract_object_is_initially_empty(self):
        contract = Contract()
        self.assertEqual(0, len(contract.subContractNames))
        self.assertEqual("", contract.name)
        self.assertEqual(0, len(contract.constraints))
        self.assertEqual(0, len(contract.skills))

    def test_create_contract_from_json_contract_details_is_not_empty(self):
        contract_dict = {
            contract_name: "Fulltime",
            sub_contract_names: ["Employee"],
            contract_skills: ["nurse, HeadNurse"],
            contract_constraints: [
                {
                    constraint_name: number_of_free_days_after_shift,
                    integer_constraint_value: "1.0",
                    constraint_weight: "hard",
                    shift_constraint: "Early"
                },
                {
                    constraint_name: total_weekends_in_four_weeks,
                    integer_constraint_value: "1.0",
                    constraint_weight: "hard"
                },
                {
                    constraint_name: min_max_num_assignments_in_four_weeks,
                    max_constraint_value: "5.0",
                    max_constraint_weight: "hard",
                    min_constraint_value: "1.0",
                    min_constraint_weight: "5.0"
                },
                {
                    constraint_name: min_max_consecutive_weekends,
                    max_constraint_value: "5.0",
                    max_constraint_weight: "hard",
                    min_constraint_value: "1.0",
                    min_constraint_weight: "5.0"
                },
                {
                    constraint_name: min_max_consecutive_shift_type,
                    max_constraint_value: "5.0",
                    max_constraint_weight: "hard",
                    min_constraint_value: "1.0",
                    min_constraint_weight: "5.0",
                    shift_constraint: "Early"
                },
                {
                    constraint_name: identical_shift_during_weekend,
                    constraint_weight: "hard"
                },
                {
                    constraint_name: complete_weekends,
                    constraint_weight: "hard"
                },
                {
                    constraint_name: unwanted_pattern,
                    unwanted_pattern_elements: [
                        {
                            pattern_element_shift: "Late",
                            pattern_element_day: "Monday"
                        },
                        {
                            pattern_element_shift: "Early",
                            pattern_element_day: "Tuesday"
                        }
                    ],
                    constraint_weight: "hard"
                },
                {
                    constraint_name: alternative_shift,
                    shift_constraint: "Early",
                    constraint_weight: "hard"
                }
            ]
        }
        contract = Contract().from_json(contract_dict)
        self.assertEqual(contract_dict, contract.to_json())
