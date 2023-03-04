from src.dao.abstract_dao import DBConnection
from src.handlers.shift_group_handler import ShiftGroupHandler
from flask import Blueprint, request, Response
from constants import shift_group_name, user_token, ok_message
from src.exceptions.project_base_exception import ProjectBaseException

mod = Blueprint("shift_group_controller", __name__, url_prefix="/shiftGroup")

shift_group_handler = ShiftGroupHandler(DBConnection.get_connection())


@mod.route("/add", methods=["POST"])
def add_shift_group():
    try:
        token = request.args[user_token]
        shift_group_dict = request.json
        shift_group_handler.add(token, shift_group_dict)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchAll", methods=["GET"])
def get_all_shift_groups():
    try:
        token = request.args[user_token]
        return shift_group_handler.get_all(token)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchByName", methods=["GET"])
def get_shift_group_by_name():
    try:
        token = request.args[user_token]
        name = request.args[shift_group_name]
        return shift_group_handler.get_by_name(token, name)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/remove", methods=["DELETE"])
def remove_shift_group():
    try:
        token = request.args[user_token]
        name = request.args[shift_group_name]
        shift_group_handler.delete(token, name)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchAllNames", methods=["GET"])
def get_shift_groups_names():
    try:
        token = request.args[user_token]
        return shift_group_handler.get_all_names(token)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/update", methods=["PUT"])
def update_shift_group():
    try:
        token = request.args[user_token]
        shift_group_dict = request.json
        shift_group_handler.update(token, shift_group_dict)
        return Response("OK", 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)
