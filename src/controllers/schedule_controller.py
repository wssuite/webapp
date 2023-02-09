from flask import Blueprint, Response
from werkzeug.exceptions import BadRequestKeyError

import error_msg
from src.utils.file_system_manager import FileSystemManager
from src.cpp_utils.schedule import Schedule
from flask import request

mod = Blueprint('schedule_controller', __name__, url_prefix='/schedule')


@mod.route('/nameFilter/<instance>', methods=["GET"])
def get_schedule_filtered_by_name(instance):
    try:
        version = request.args["version"]
    except BadRequestKeyError:
        return Response(error_msg.version_required, 400)
    try:
        file_path = FileSystemManager.get_solution_path(instance, version)
        schedule = Schedule(file_path)
        return schedule.filter_by_name()
    except OSError as e:
        return Response(e.args, 500)
    except Exception as e:
        return Response(e.args, 500)
