from src.exceptions.project_base_exception import ProjectBaseException
from error_msg import contract_creation_error


class ContractContradictionException(ProjectBaseException):

    def __init__(self, added_contract, existing_contract, constraints):
        msg = contract_creation_error.format(
            added_contract, existing_contract,
            constraints)
        super().__init__(msg)
