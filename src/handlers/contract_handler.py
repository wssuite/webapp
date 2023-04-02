from src.handlers.base_handler import BaseHandler
from src.dao.contract_dao import Contract
from constants import (
    nurse_contracts,
    nurse_group_contracts_list,
    nurse_name,
    contract_name,
    nurse_username,
    nurse_group_name,
)
from src.utils.contracts_validator import ContractsValidator
from src.exceptions.contract_exceptions import (
    CannotDeleteContract,
    ContractNotExist,
)


class ContractHandler(BaseHandler):
    def __init__(self, mongo):
        super().__init__(mongo)

    """
    To add a contract we will perform a check on the token
    that is passed as a parameter.
    Then we must check that the shifts implied in the contract exist
    If all checks succeed we can safely add the new contract to the dao.
    The dao itself will check if there is another contract with the same
    name.
    """

    def add(self, token, json):
        super().add(token, json)
        contract = Contract().from_json(json)
        self.contract_insertion_verification(contract)
        self.contract_dao.insert_one(contract.db_json())

    """
    Before updating a contract we will perform the verifications that
    were done for the insertion operation.
    Additionally, we will verify that the modification that we are about
    to perform doesn't affect the combination of contracts that implied
    nurses/nurse groups have.
    """

    def update(self, token, json):
        super().update(token, json)
        contract = Contract().from_json(json)
        self.contract_insertion_verification(contract)
        nurses_with_contract = self.nurse_dao.get_with_contracts(
            [contract.name], contract.profile
        )
        nurse_groups = self.nurse_group_dao.get_with_contracts(
            [contract.name], contract.profile
        )
        self.contract_validation_with_other_contracts(
            nurses_with_contract, nurse_contracts, contract
        )
        self.contract_validation_with_other_contracts(
            nurse_groups, nurse_group_contracts_list, contract
        )
        self.contract_dao.update(contract.db_json())

    def contract_validation_with_other_contracts(self, array, tag, contract):
        for nurse in array:
            other_contracts_names = nurse.setdefault(tag, [])
            """Remove the contract that we are trying to modify"""
            other_contracts_names.remove(contract.name)
            """
            We suppose that other contracts don't have conflicts.
            This verification will be done however when inserting/updating
            a nurse or a nurse group.
            Consequently, we will perform a merge operation on the other
            contracts to reduce time complexity
            """
            verification_contract = Contract()
            verification_contract.name = f"{nurse[nurse_name]} other contracts"
            for other_contract_name in other_contracts_names:
                contract_dict = self.contract_dao.find_by_name(
                    other_contract_name, contract.profile
                )
                other_contract = Contract().from_json(contract_dict)
                verification_contract.merge_contract_constraints(
                    other_contract
                )

            validator = ContractsValidator()
            validator.add_contract_constraints(verification_contract)
            validator.add_contract_constraints(contract)

    """
    To delete a contract, it must not
    be used by any nurse nor any nurse groups
    """

    def delete(self, token, name, profile_name):
        super().delete(token, name, profile_name)
        usage = []
        usage.extend(
            [
                nurse[nurse_username]
                for nurse in self.nurse_dao.get_with_contracts(
                    [name], profile_name
                )
            ]
        )
        usage.extend(
            [
                nurse_group[nurse_group_name]
                for nurse_group in self.nurse_group_dao.get_with_contracts(
                    [name], profile_name
                )
            ]
        )
        if len(usage) > 0:
            raise CannotDeleteContract(name, usage)
        self.contract_dao.remove(name, profile_name)

    def get_all(self, token, profile_name):
        super().get_all(token, profile_name)
        return self.contract_dao.fetch_all(profile_name)

    def get_by_name(self, token, name, profile_name):
        super().get_by_name(token, name, profile_name)
        contract_dict = self.contract_dao.find_by_name(name, profile_name)
        if contract_dict is None:
            raise ContractNotExist(name)
        return Contract().from_json(contract_dict).to_json()

    def get_all_names(self, token, profile_name):
        return [
            contract[contract_name]
            for contract in self.get_all(token, profile_name)
        ]
