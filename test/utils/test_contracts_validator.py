from src.utils.contracts_validator import ContractsValidator, Contract,\
    ContractCreationException
from unittest import TestCase
from constants import contract_constraints, contract_name, \
    constraint_name, shift_constraint, alternative_shift, \
    constraint_weight, sub_contract_names, contract_skills


class TestContractsValidator(TestCase):
    def setUp(self) -> None:
        self.base_contract_dict = {
            contract_name: "General",
            sub_contract_names: [],
            contract_skills: [],
            contract_constraints: [
                {
                    constraint_name: alternative_shift,
                    shift_constraint: "Early",
                    constraint_weight: "hard"
                }
            ]
        }

        self.problematic_contract = {
            contract_name: "FullTime",
            sub_contract_names: [],
            contract_skills: [],
            contract_constraints: [
                {
                    constraint_name: alternative_shift,
                    shift_constraint: "Early",
                    constraint_weight: "1.0"
                }
            ]
        }

        self.valid_contract = {
            contract_name: "FullTime",
            sub_contract_names: [],
            contract_skills: [],
            contract_constraints: [
                {
                    constraint_name: alternative_shift,
                    shift_constraint: "Late",
                    constraint_weight: "1.0"
                }
            ]
        }

    def tearDown(self) -> None:
        pass

    def test_add_first_contract_to_validator_gets_added(self):
        contract = Contract().from_json(self.base_contract_dict)
        validator = ContractsValidator()
        validator.add_contract_constraints(contract)
        self.assertEqual([constraint.repr() for constraint in
                          contract.constraints],
                         validator.constraints[contract.name])

    def test_add_contradicting_contract_throws_exception(self):
        base_contract = Contract().from_json(self.base_contract_dict)
        problematic_contract = Contract().from_json(self.problematic_contract)
        validator = ContractsValidator()
        validator.add_contract_constraints(base_contract)
        with self.assertRaises(ContractCreationException):
            validator.add_contract_constraints(problematic_contract)

    def test_add_valid_contract_to_existing_contract_gets_validated(self):
        base_contract = Contract().from_json(self.base_contract_dict)
        valid_contract = Contract().from_json(self.valid_contract)
        validator = ContractsValidator()
        validator.add_contract_constraints(base_contract)
        validator.add_contract_constraints(valid_contract)
        self.assertEqual([constraint.repr() for constraint in
                          valid_contract.constraints],
                         validator.constraints[valid_contract.name])
