from src.dao.abstract_dao import DBConnection
from src.handlers.shift_handler import ShiftHandler
from flask import Blueprint, request, Response
from constants import shift_name, user_token, ok_message, profile
from src.exceptions.project_base_exception import ProjectBaseException

mod = Blueprint("shift_controller", __name__, url_prefix="/shift")

shift_handler = ShiftHandler(DBConnection.get_connection())


@mod.route("/add", methods=["POST"])
def add_shift():
    try:
        token = request.args[user_token]
        shift_dict = request.json
        shift_handler.add(token, shift_dict)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchAll", methods=["GET"])
def get_all_shifts():
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        return shift_handler.get_all(token, profile_name)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchByName", methods=["GET"])
def get_shift_by_name():
    try:
        token = request.args[user_token]
        name = request.args[shift_name]
        profile_name = request.args[profile]
        return shift_handler.get_by_name(token, name, profile_name)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/remove", methods=["DELETE"])
def remove_shift():
    try:
        token = request.args[user_token]
        name = request.args[shift_name]
        profile_name = request.args[profile]
        shift_handler.delete(token, name, profile_name)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchAllNames", methods=["GET"])
def get_shifts_names():
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        return shift_handler.get_all_names(token, profile_name)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/update", methods=["PUT"])
def update_shift():
    try:
        token = request.args[user_token]
        shift_dict = request.json
        shift_handler.update(token, shift_dict)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)
