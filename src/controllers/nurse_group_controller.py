from flask import Blueprint, request, Response
from src.handlers.nurse_group_handler import NurseGroupHandler
from src.dao.abstract_dao import DBConnection
from constants import nurse_group_name, user_token, ok_message, profile
from src.exceptions.project_base_exception import ProjectBaseException

mod = Blueprint("nurse_group_controller", __name__, url_prefix="/nurseGroup")

nurse_group_handler = NurseGroupHandler(DBConnection.get_connection())


@mod.route("/add", methods=["POST"])
def add_nurse_group():
    try:
        token = request.args[user_token]
        nurse_group_dict = request.json
        nurse_group_handler.add(token, nurse_group_dict)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchAll", methods=["GET"])
def get_all_nurse_groups():
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        return nurse_group_handler.get_all(token, profile_name)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchByName", methods=["GET"])
def get_nurse_group_by_name():
    try:
        token = request.args[user_token]
        name = request.args[nurse_group_name]
        profile_name = request.args[profile]
        return nurse_group_handler.get_by_name(token, name, profile_name)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/remove", methods=["DELETE"])
def delete_nurse():
    try:
        token = request.args[user_token]
        name = request.args[nurse_group_name]
        profile_name = request.args[profile]
        nurse_group_handler.delete(token, name, profile_name)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchAllNames", methods=["GET"])
def get_nurse_group_names():
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        return nurse_group_handler.get_all_names(token, profile_name)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/update", methods=["PUT"])
def update_nurse():
    try:
        token = request.args[user_token]
        update_dict = request.json
        nurse_group_handler.update(token, update_dict)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)
