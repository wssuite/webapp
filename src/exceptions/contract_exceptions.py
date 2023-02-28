from src.exceptions.project_base_exception import ProjectBaseException
from error_msg import (contract_contradiction_error,
                       contract_already_exist,
                       contract_deletion_error,
                       contract_not_exist)


class ContractContradictionException(ProjectBaseException):
    def __init__(self, added_contract, existing_contract, constraints):
        msg = contract_contradiction_error.format(
            added_contract, existing_contract, constraints
        )
        super().__init__(msg)


class ContractAlreadyExistException(ProjectBaseException):
    def __init__(self, new_contract_name):
        msg = contract_already_exist.format(new_contract_name)
        super().__init__(msg)


class CannotDeleteContract(ProjectBaseException):
    def __init__(self, name):
        msg = contract_deletion_error.format(name)
        super(CannotDeleteContract, self).__init__(msg)


class ContractNotExist(ProjectBaseException):
    def __init__(self, name):
        msg = contract_not_exist.format(name)
        super(ContractNotExist, self).__init__(msg)
