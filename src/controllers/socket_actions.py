import os

from src.models.schedule import Schedule
from src.utils.file_system_manager import FileSystemManager
from constants import version, start_date, end_date, profile
from src.utils.repeatable_thread import RepeatableThread
from .. import socketio
from flask_socketio import join_room, leave_room


thread_dict: dict[str, RepeatableThread] = {}
room_counter_dict = {}


def emit_schedule(json):
    sol_folder_path = FileSystemManager.get_solution_dir_path(
        json[profile], json[start_date], json[end_date], json[version]
    )
    sol_file_path = os.path.join(sol_folder_path, "sol.txt")
    room = create_room_name_from_json(json)
    socketio.emit(
        "update_visualisation",
        Schedule(sol_file_path).filter_by_name(),
        room=f"visualisation_{room}",
    )


def create_room_name_from_json(json):
    return os.path.join(
        json[profile], f"{json[start_date]}_{json[end_date]}", json[version]
    )


@socketio.on("join_notification")
def handle_join_status(json):
    room = create_room_name_from_json(json)
    join_room(f"notification_{room}")


@socketio.on("leave_notification")
def handle_leave_status(json):
    room = create_room_name_from_json(json)
    leave_room(f"notification_{room}")


@socketio.on("join_visualisation")
def handle_join_continuous_visualisation(json):
    room = create_room_name_from_json(json)
    join_room(f"visualisation_{room}")
    """
        TODO: start thread and add it it to a dict if not exist
        Increment counter
    """
    if thread_dict.get(room) is None:
        thread_dict[room] = RepeatableThread(emit_schedule, json)

    if room_counter_dict.get(room) is None:
        room_counter_dict[room] = 1
    else:
        room_counter_dict[room] = room_counter_dict[room] + 1


@socketio.on("leave_visualisation")
def handle_leave_continuous_visualisation(json):
    room = create_room_name_from_json(json)
    leave_room(f"visualisation_{room}")
    """
        TODO: stop thread if no other user is in the room 
    """
    room_counter_dict[room] = room_counter_dict[room] - 1
    if room_counter_dict[room] == 0:
        thread = thread_dict.pop(room)
        thread.stop_event.set()
