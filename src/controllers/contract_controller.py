from flask import Blueprint, request, Response
from src.handlers.contract_handler import ContractHandler
from src.dao.abstract_dao import connect_to_db
from constants import ok_message, contract_name
from src.exceptions.project_base_exception import ProjectBaseException
from constants import user_token

mod = Blueprint("contract_controller", __name__, url_prefix="/contract")

contract_handler = ContractHandler(connect_to_db())


@mod.route("/add", methods=["POST"])
def add_contract():
    try:
        token = request.args[user_token]
        contract_dict = request.json
        contract_handler.add(token, contract_dict)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchAll", methods=["GET"])
def get_all_contracts():
    token = request.args[user_token]
    return contract_handler.get_all(token)


@mod.route("/fetchByName", methods=["GET"])
def get_contract_by_name():
    try:
        name = request.args[contract_name]
        token = request.args[user_token]
        return contract_handler.get_by_name(token, name)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/remove", methods=["DELETE"])
def delete_contract():
    try:
        name = request.args[contract_name]
        token = request.args[user_token]
        contract_handler.delete(token, name)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchAllNames", methods=["GET"])
def get_contracts_names():
    token = request.args[user_token]
    return contract_handler.get_all_names(token)


@mod.route("/update", methods=["PUT"])
def update_contract():
    try:
        contract_dict = request.json
        token = request.args[user_token]
        contract_handler.update(token, contract_dict)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)
