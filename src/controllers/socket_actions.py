import os

from constants import version, start_date, end_date, profile
from .. import socketio
from flask_socketio import join_room, leave_room


@socketio.on("join_notification")
def handle_join_status(json):
    room = os.path.join(
        json[profile], f"{json[start_date]}_{json[end_date]}", json[version]
    )
    join_room(f"notification_{room}")


@socketio.on("leave_notification")
def handle_leave_status(json):
    room = os.path.join(
        json[profile], f"{json[start_date]}_{json[end_date]}", json[version]
    )
    leave_room(f"notification_{room}")
