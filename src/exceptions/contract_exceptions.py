from src.exceptions.project_base_exception import ProjectBaseException
from error_msg import (
    contract_contradiction_error,
    contract_creation_error_contradiction,
    contract_already_exist,
    contract_tree_too_big
)


class ContractContradictionException(ProjectBaseException):
    def __init__(self, added_contract, existing_contract, constraints):
        msg = contract_contradiction_error.format(
            added_contract, existing_contract, constraints
        )
        super().__init__(msg)


class ContractCreationContradictionException(ProjectBaseException):
    def __init__(self, new_contract_name, msg):
        new_msg = contract_creation_error_contradiction. \
            format(new_contract_name, msg)
        super().__init__(new_msg)


class ContractAlreadyExistException(ProjectBaseException):
    def __init__(self, new_contract_name):
        msg = contract_already_exist.format(new_contract_name)
        super().__init__(msg)


class ContractTreeTooLarge(ProjectBaseException):
    def __init__(self):
        super().__init__(contract_tree_too_big)
