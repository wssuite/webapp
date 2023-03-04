from src.exceptions.project_base_exception import ProjectBaseException
from src.handlers.skill_handler import SkillHandler
from src.dao.abstract_dao import connect_to_db
from flask import Blueprint, request, Response
from constants import user_token

mod = Blueprint("skill_controller", __name__, url_prefix="/skill")

skill_handler = SkillHandler(connect_to_db())


@mod.route("/fetchAll", methods=["GET"])
def get_all_skills():
    try:
        token = request.args[user_token]
        return skill_handler.get_all(token)
    except ProjectBaseException as e:
        return Response(e.args, 500)
