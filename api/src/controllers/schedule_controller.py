from flask import Response
from . import schedule_mod as mod
from flask import request
from src.controllers.socket_actions import create_room_name_from_json
from src.exceptions.project_base_exception import ProjectBaseException
from constants import (
    user_token,
    profile,
    start_date,
    end_date,
    version,
    format,
    ok_message,
)
from src.dao.abstract_dao import DBConnection
from src.handlers.schedule_handler import ScheduleHandler
from .. import socketio

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

    The content of the file sol.txt must respect the format of the ui
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

        if format in request.args and request.args[format] == "json":
            # replace .txt by .json
            path = path.rsplit(".", 1)[0] + ".json"

        with open(path) as file:
            return {"content": file.read()}
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


@mod.route("/config", methods=["GET"])
def get_params():
    try:
        token = request.args[user_token]
        return schedule_handler.proxy_worker(token, "config")
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/stopGeneration", methods=["POST"])
def stop_schedule_generation():
    try:
        token = request.args[user_token]
        json = request.json
        schedule_handler.stop_generation(token, json)
        return Response(ok_message, 200)
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


"""
    This endpoint will only be called by the worker
     generating the schedule
"""


@mod.route("/updateStatus", methods=["POST"])
def update_solution_satus():
    stat_json = schedule_handler.update_solution_state(request.json)
    room = create_room_name_from_json(request.json)
    print("update_notification", f"notification_{room}")
    socketio.emit("update_notification", stat_json, to=f"notification_{room}")
    return Response(ok_message, 200)


@mod.route("/updateSolution", methods=["POST"])
def update_solution():
    sol_json = schedule_handler.update_solution(request.json)
    room = create_room_name_from_json(request.json)
    print("update_visualisation", f"visualisation_{room}")
    socketio.emit("update_visualisation", sol_json, to=f"visualisation_{room}")
    return Response(ok_message, 200)


@mod.route("/removeSolution", methods=["DELETE"])
def remove_solution():
    try:
        token = request.args[user_token]
        start = request.args[start_date]
        end = request.args[end_date]
        profile_name = request.args[profile]
        v = request.args[version]
        schedule_handler.remove_schedule(token, start, end, profile_name, v)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/exportSchedule", methods=["GET"])
def export_schedule():
    try:
        token = request.args[user_token]
        start = request.args[start_date]
        end = request.args[end_date]
        profile_name = request.args[profile]
        v = request.args[version]
        schedule_str = schedule_handler.export_schedule(
            token, start, end, profile_name, v
        )
        return {"content": schedule_str}
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/exportError", methods=["GET"])
def export_error():
    try:
        token = request.args[user_token]
        start = request.args[start_date]
        end = request.args[end_date]
        profile_name = request.args[profile]
        v = request.args[version]
        error_str = schedule_handler.export_std_error(
            token, start, end, profile_name, v
        )
        return {"content": error_str}
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/getStatistics", methods=["GET"])
def get_statistics():
    try:
        token = request.args[user_token]
        start = request.args[start_date]
        end = request.args[end_date]
        profile_name = request.args[profile]
        v = request.args[version]
        statistics = schedule_handler.get_statistics(
            token, start, end, profile_name, v
        )
        return statistics
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/importSolution", methods=["POST"])
def import_solution():
    try:
        token = request.args[user_token]
        file = request.files["file"]
        return schedule_handler.import_solution(token, file)
    except ProjectBaseException as e:
        return Response(e.args, 500)

