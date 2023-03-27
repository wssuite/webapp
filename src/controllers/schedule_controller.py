from flask import Response
from . import schedule_mod as mod
from flask import request
from src.exceptions.project_base_exception import ProjectBaseException
from constants import user_token, profile, start_date, end_date, version
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

schedule_handler = ScheduleHandler(DBConnection.get_connection())


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
        v = request.args[version]
        path = schedule_handler.get_input_problem_path(
            token, profile_name, start, end, v
        )
        problem_str = ""
        with open(path) as file:
            lines = file.readlines()
            for line in lines:
                problem_str += line

        return {"content": problem_str}
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/regenerate", methods=["POST"])
def regenerate_schedule():
    try:
        token = request.args[user_token]
        json = request.json
        v = request.args[version]
        return schedule_handler.regenerate_schedule(token, json, v)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/getDetailedSolution", methods=["GET"])
def get_detailed_solution():
    try:
        token = request.args[user_token]
        start = request.args[start_date]
        end = request.args[end_date]
        profile_name = request.args[profile]
        v = request.args[version]
        return schedule_handler.get_detailed_solution(
            token, start, end, profile_name, v
        )
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/getAllSolutions", methods=["GET"])
def get_all_solutions():
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        return schedule_handler.get_all_solutions(token, profile_name)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/getLatestSolutions", methods=["GET"])
def get_latest_solutions():
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        return schedule_handler.get_latest_solutions_versions(
            token, profile_name
        )
    except ProjectBaseException as e:
        return Response(e.args, 500)
