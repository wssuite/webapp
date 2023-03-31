from flask import request, Response
from src.handlers.nurse_handler import NurseHandler
from src.dao.abstract_dao import DBConnection
from constants import nurse_username, user_token, ok_message, profile
from src.exceptions.project_base_exception import ProjectBaseException
from . import nurse_mod as mod

nurse_handler = NurseHandler(DBConnection.get_connection())


@mod.route("/add", methods=["POST"])
def add_nurse():
    try:
        nurse_dict = request.json
        token = request.args[user_token]
        nurse_handler.add(token, nurse_dict)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchAll", methods=["GET"])
def get_all_nurses():
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        return nurse_handler.get_all(token, profile_name)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchByUsername", methods=["GET"])
def get_nurse_by_username():
    try:
        token = request.args[user_token]
        username = request.args[nurse_username]
        profile_name = request.args[profile]
        return nurse_handler.get_by_username(token, username, profile_name)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/remove", methods=["DELETE"])
def delete_nurse():
    try:
        token = request.args[user_token]
        username = request.args[nurse_username]
        profile_name = request.args[profile]
        nurse_handler.delete(token, username, profile_name)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchAllUsernames", methods=["GET"])
def get_nurses_usernames():
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        return nurse_handler.get_all_usernames(token, profile_name)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/update", methods=["PUT"])
def update_nurse():
    try:
        token = request.args[user_token]
        update_dict = request.json
        nurse_handler.update(token, update_dict)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)
