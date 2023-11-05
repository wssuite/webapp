import os
from threading import Thread

from .handler import (
    handle_schedule,
    base_directory,
    handle_stop_event,
    possible_configs
)

from flask import Blueprint, request, Response
import sys

mod = Blueprint("controller", __name__, url_prefix="/solver")


@mod.route("/test", methods=["POST"])
def test():
    try:
        return sys.argv[1]
    except IndexError:
        return request.host


@mod.route("/schedule", methods=["GET", "POST"])
def schedule():
    handle_schedule(request.args.to_dict())
    return sys.argv[1] if len(sys.argv) > 1 else "localhost"  # worker hostname


@mod.route("/stop", methods=["GET", "POST"])
def stop():
    path = request.args["path"]
    path = path[1:]
    full_path = os.path.join(base_directory, path)
    process = Thread(target=handle_stop_event, args=(full_path,))
    process.start()
    return "ok_message"


@mod.route("/config", methods=["GET", "POST"])
def params():
    return possible_configs()
