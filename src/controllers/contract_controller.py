from flask import Blueprint, request, Response
from src.dao.contract_dao import ContractDao
from src.dao.abstract_dao import connect_to_db
from src.models.contract import Contract
from constants import ok_message, contract_name

mod = Blueprint("contract_controller", __name__, url_prefix="/contract")

contract_dao = ContractDao(connect_to_db())

"""
TODO: Before adding a contract it will be necessary
to verify that the shifts included in the contract
exist
"""


@mod.route("/add", methods=["POST"])
def add_contract():
    contract_dict = request.json
    contract = Contract().from_json(contract_dict)
    contract_dao.insert_one(contract.db_json())
    return Response(ok_message, 200)


@mod.route("/fetchAll", methods=["GET"])
def get_all_contracts():
    return contract_dao.fetch_all()


@mod.route("/fetchByName", methods=["GET"])
def get_contract_by_name():
    name = request.args[contract_name]
    return contract_dao.find_by_name(name)


"""
TODO: Verify that the contract isn't associated to a
 nurse or nurse group before deleting the contract
"""


@mod.route("/remove", methods=["DELETE"])
def delete_contract():
    name = request.args[contract_name]
    contract_dao.remove(name)
    return Response(ok_message, 200)


@mod.route("/fetchAllNames", methods=["GET"])
def get_contracts_names():
    all_contracts = contract_dao.fetch_all()
    return [contract[contract_name] for contract in all_contracts]


"""
TODO: Before updating a contract, verify that the update
 doesn't have any conflicts with the combination of
 contracts for different nurses.
 Verify that the shifts included in the updated contract
 exist
"""


@mod.route("/update", methods=["PUT"])
def update_contract():
    contract_dict = request.json
    contract = Contract().from_json(contract_dict)
    contract_dao.update(contract.db_json())
    return Response(ok_message, 200)
