from src.dao.abstract_dao import DBConnection
from src.handlers.shift_type_handler import ShiftTypeHandler
from flask import request, Response
from constants import shift_type_name, user_token, ok_message, profile
from src.exceptions.project_base_exception import ProjectBaseException
from . import shift_type_mod as mod

shift_type_handler = ShiftTypeHandler(DBConnection.get_connection())


@mod.route("/add", methods=["POST"])
def add_shift_type():
    try:
        token = request.args[user_token]
        shift_type_dict = request.json
        shift_type_handler.add(token, shift_type_dict)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchAll", methods=["GET"])
def get_all_shift_types():
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        return shift_type_handler.get_all(token, profile_name)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchByName", methods=["GET"])
def get_shift_type_by_name():
    try:
        token = request.args[user_token]
        name = request.args[shift_type_name]
        profile_name = request.args[profile]
        return shift_type_handler.get_by_name(token, name, profile_name)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/remove", methods=["DELETE"])
def remove_shift_type():
    try:
        token = request.args[user_token]
        name = request.args[shift_type_name]
        profile_name = request.args[profile]
        shift_type_handler.delete(token, name, profile_name)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchAllNames", methods=["GET"])
def get_shift_types_names():
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        return shift_type_handler.get_all_names(token, profile_name)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/update", methods=["PUT"])
def update_shift_type():
    try:
        token = request.args[user_token]
        shift_type_dict = request.json
        shift_type_handler.update(token, shift_type_dict)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 200)
