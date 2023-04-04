from src.dao.abstract_dao import DBConnection
from src.handlers.user_handler import AuthenticationHandler
from flask import request, Response
from constants import user_token, user_username, ok_message
from src.exceptions.project_base_exception import ProjectBaseException
from . import user_mod as mod

handler = AuthenticationHandler(DBConnection.get_connection())


@mod.route("/login", methods=["POST"])
def login():
    try:
        json = request.get_json()
        return handler.login(json)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/delete", methods=["DELETE"])
def delete_user():
    try:
        token = request.args[user_token]
        username = request.args[user_username]
        handler.delete_user(username, token)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/add", methods=["POST"])
def create_user():
    try:
        token = request.args[user_token]
        json = request.json
        handler.create_user(json, token)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/logout", methods=["POST"])
def logout():
    try:
        token = request.args[user_token]
        handler.logout(token)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchAllUsernames", methods=["GET"])
def get_all_usernames():
    try:
        token = request.args[user_token]
        return handler.get_all_usernames(token)
    except ProjectBaseException as e:
        return Response(e.args, 500)
