from src.utils.contracts_validator import ContractsValidator, Contract
from unittest import TestCase
from constants import contract_constraints, contract_name, \
    constraint_name, shift_constraint, alternative_shift, \
    constraint_weight, sub_contract_names, contract_skills


class TestContractsValidator(TestCase):
    def setUp(self) -> None:
        pass

    def tearDown(self) -> None:
        pass

    def test_add_first_contract_to_validator_gets_added(self):
        contract_json = {
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
        contract = Contract()
        contract.from_json(contract_json)
        validator = ContractsValidator()
        validator.add_contract_constraints(contract)
        self.assertEqual([constraint.repr() for constraint in
                          contract.constraints],
                         validator.constraints[contract.name])
