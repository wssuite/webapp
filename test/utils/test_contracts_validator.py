from src.utils.contracts_validator import ContractsValidator, Contract, \
    ContractContradictionException
from unittest import TestCase
from test_constants import general_contract_dict, \
    full_time_not_valid_contract_with_general,\
    full_time_valid_contract_with_general


class TestContractsValidator(TestCase):
    def setUp(self) -> None:
        self.base_contract_dict = general_contract_dict

        self.problematic_contract = \
            full_time_not_valid_contract_with_general

        self.valid_contract = \
            full_time_valid_contract_with_general

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
        with self.assertRaises(ContractContradictionException):
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
