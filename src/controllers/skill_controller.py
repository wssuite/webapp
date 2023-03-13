from src.exceptions.project_base_exception import ProjectBaseException
from src.handlers.skill_handler import SkillHandler
from src.dao.abstract_dao import DBConnection
from flask import Blueprint, request, Response
from constants import user_token, profile, ok_message, skill_name

mod = Blueprint("skill_controller", __name__, url_prefix="/skill")

skill_handler = SkillHandler(DBConnection.get_connection())


@mod.route("/fetchAll", methods=["GET"])
def get_all_skills():
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        return skill_handler.get_all(token, profile_name)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/add", methods=["POST"])
def add_skill():
    try:
        token = request.args[user_token]
        skill_dict = request.json
        skill_handler.add(token, skill_dict)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/delete", methods=["DELETE"])
def delete_skill():
    try:
        token = request.args[user_token]
        name = request.args[skill_name]
        profile_name = request.args[profile]
        skill_handler.delete(token, name, profile_name)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("fetchAllNames", methods=["GET"])
def get_all_skill_names():
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        return skill_handler.get_all_names(token, profile_name)
    except ProjectBaseException as e:
        return Response(e.args, 500)
