from src.exceptions.project_base_exception import ProjectBaseException
from src.handlers.skill_handler import SkillHandler
from src.dao.abstract_dao import DBConnection
from flask import Blueprint, request, Response
from constants import user_token, profile

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
