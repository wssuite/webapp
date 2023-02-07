from flask import Blueprint
from src.utils.file_system_manger import FileSystemManager
from src.cpp_utils.schedule import Schedule

mod = Blueprint('schedule_controller', __name__, url_prefix='/schedule')


@mod.route('/nameFilter/<instance>/<version>', methods=["GET"])
def get_schedule_filtered_by_name(instance, version):
    file_path = FileSystemManager.get_solution_path(instance, version)
    schedule = Schedule(file_path)
    return schedule.filter_by_name()
