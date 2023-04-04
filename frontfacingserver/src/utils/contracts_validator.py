from src.models.contract import Contract
from src.exceptions.contract_exceptions import ContractContradictionException

"""
This class validates that multiple contracts don't contradict with
each other
"""


class ContractsValidator:
    def __init__(self):
        self.constraints = {}

    def add_contract_constraints(self, contract: Contract):
        contract_constraints = contract.constraints
        for key in self.constraints.keys():
            previous_contract_constraints = self.constraints[key]
            problematic_constraints = []
            for constraint in contract_constraints:
                if constraint.repr() in previous_contract_constraints:
                    problematic_constraints.append(constraint.repr())

            if len(problematic_constraints) > 0:
                raise ContractContradictionException(
                    contract.name, key, problematic_constraints
                )

        self.constraints[contract.name] = [
            constraint.repr() for constraint in contract.constraints
        ]
