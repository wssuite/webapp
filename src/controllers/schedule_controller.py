from flask import Blueprint, Response
from werkzeug.exceptions import BadRequestKeyError

import error_msg
from src.utils.file_system_manager import FileSystemManager
from src.models.schedule import Schedule
from flask import request
from src.exceptions.project_base_exception import ProjectBaseException
from constants import user_token, profile, start_date, end_date
from src.dao.abstract_dao import DBConnection
from src.handlers.schedule_handler import ScheduleHandler

"""
    To manually test these endpoints, in the project's root, please create
    directories with the following tree structure:

        dataset
        |
        |-<instance>
            |
            |_<version>
                |
                |_ sol.txt

    The content of the file sol.txt must respect the format agreed
    with the client, please consult the following link:
    https://gitlab.com/polytechnique-montr-al/log89xx/23-1/equipe-10/LOG89XX-10/-/blob/dataset/file-format/dataset/examples/sol-instance1.txt
"""
mod = Blueprint("schedule_controller", __name__, url_prefix="/schedule")

schedule_handler = ScheduleHandler(DBConnection.get_connection())


@mod.route("/nameFilter/<instance>", methods=["GET"])
def get_schedule_filtered_by_name(instance):
    try:
        version = request.args["version"]
    except BadRequestKeyError:
        return Response(error_msg.version_required, 400)
    try:
        file_path = FileSystemManager.get_solution_path(instance, version)
        schedule = Schedule(file_path)
        return schedule.filter_by_name()
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/generate", methods=["POST"])
def generate_schedule():
    try:
        token = request.args[user_token]
        json = request.json
        return schedule_handler.generate_schedule(token, json)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/exportProblem", methods=["GET"])
def export_problem():
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        start = request.args[start_date]
        end = request.args[end_date]
        version = request.args["version"]
        path = schedule_handler.get_input_problem_path(
            token, profile_name, start, end, version
        )
        problem_str = ""
        with open(path) as file:
            lines = file.readlines()
            for line in lines:
                problem_str += line

        return {'content': problem_str}
    except ProjectBaseException as e:
        return Response(e.args, 500)
