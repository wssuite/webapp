import os
import requests
from threading import Lock
from src.utils.file_system_manager import FileSystemManager
from constants import version, start_date, end_date, profile
from src.utils.repeatable_thread import RepeatableThread
from .. import socketio
from flask_socketio import join_room, leave_room, rooms
from datetime import datetime


thread_dict_lock = Lock()
thread_dict: dict[str, RepeatableThread] = {}
room_counter_dict_lock = Lock()
room_counter_dict = {}


def emit_schedule(json, last_modification=None):
    sol_folder_path = FileSystemManager.get_solution_dir_path(
        json[profile], json[start_date], json[end_date], json[version]
    )
    sol_file_path = os.path.join(sol_folder_path, "sol.txt")
    file_modification = os.path.getmtime(sol_file_path)

    try:
        # if a new file, ask for update, otherwise do nothing
        if file_modification != last_modification:
            requests.post(
                f"http://localhost:5000/schedule/updateSolution",
                json=json
            )
        return file_modification
    except Exception as e:
        print(f"Cannot send last modification ({last_modification}) as encountered an error:", e)
        return last_modification


def create_room_name_from_json(json):
    return os.path.join(
        json[profile], f"{json[start_date]}_{json[end_date]}", json[version]
    )


@socketio.on("join_notification")
def handle_join_status(json):
    room = create_room_name_from_json(json)
    print("join_notification", f"notification_{room}")
    join_room(f"notification_{room}")
    socketio.emit(
        'join_room',
        {'room': f"notification_{room}", 'at': str(datetime.now())},
        to=f"notification_{room}"
    )


@socketio.on("leave_notification")
def handle_leave_status(json):
    room = create_room_name_from_json(json)
    print("leave_notification", f"notification_{room}")
    socketio.emit(
        'leave_room',
        {'room': f"notification_{room}", 'at': str(datetime.now())},
        to=f"notification_{room}"
    )
    leave_room(f"notification_{room}")


@socketio.on("join_visualisation")
def handle_join_continuous_visualisation(json):
    room = create_room_name_from_json(json)
    print("join_visualisation", f"visualisation_{room}")
    join_room(f"visualisation_{room}")
    socketio.emit(
        'join_room',
        {'room': f"visualisation_{room}", 'at': str(datetime.now())},
        to=f"visualisation_{room}"
    )
    """
        TODO: start thread and add it it to a dict if not exist
        Increment counter
    """
    with thread_dict_lock:
        if thread_dict.get(room) is None:
            thread_dict[room] = RepeatableThread(emit_schedule, json)
            thread_dict[room].start()

    with room_counter_dict_lock:
        if room_counter_dict.get(room) is None:
            room_counter_dict[room] = 1
        else:
            room_counter_dict[room] = room_counter_dict[room] + 1


@socketio.on("leave_visualisation")
def handle_leave_continuous_visualisation(json):
    room = create_room_name_from_json(json)
    print("leave_visualisation", f"visualisation_{room}")
    socketio.emit(
        'leave_room',
        {'room': f"visualisation_{room}", 'at': str(datetime.now())},
        to=f"visualisation_{room}"
    )
    leave_room(f"visualisation_{room}")
    """
        TODO: stop thread if no other user is in the room 
    """
    with room_counter_dict_lock:
        if room_counter_dict[room] > 0:
            room_counter_dict[room] = room_counter_dict[room] - 1

        if room_counter_dict[room] == 0:
            with thread_dict_lock:
                thread = thread_dict.pop(room)
                thread.stop_event.set()


@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')
