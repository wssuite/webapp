from src.exceptions.project_base_exception import ProjectBaseException
from error_msg import contract_contradiction_error, contract_already_exist


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
