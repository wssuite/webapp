from flask import request, Response
from src.handlers.contract_handler import ContractHandler
from src.dao.abstract_dao import DBConnection
from constants import ok_message, contract_name, user_token, profile
from src.exceptions.project_base_exception import ProjectBaseException
from . import contract_mod as mod

contract_handler = ContractHandler(DBConnection.get_connection())


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
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        return contract_handler.get_all(token, profile_name)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchByName", methods=["GET"])
def get_contract_by_name():
    try:
        name = request.args[contract_name]
        token = request.args[user_token]
        profile_name = request.args[profile]
        return contract_handler.get_by_name(token, name, profile_name)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/remove", methods=["DELETE"])
def delete_contract():
    try:
        name = request.args[contract_name]
        token = request.args[user_token]
        profile_name = request.args[profile]
        contract_handler.delete(token, name, profile_name)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchAllNames", methods=["GET"])
def get_contracts_names():
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        return contract_handler.get_all_names(token, profile_name)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/update", methods=["PUT"])
def update_contract():
    try:
        contract_dict = request.json
        token = request.args[user_token]
        contract_handler.update(token, contract_dict)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)
