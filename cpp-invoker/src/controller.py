import os
from threading import Thread

from .handler import (
    add_to_waiting,
    base_directory,
    handle_stop_event
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


@mod.route("/schedule", methods=["POST"])
def schedule():
    path = request.args["path"]
    path = path[1:]
    full_path = os.path.join(base_directory, path)
    add_to_waiting(full_path, 1)
    return Response(sys.argv[1], status=200)


@mod.route("/stop", methods=["POST"])
def stop():
    path = request.args["path"]
    path = path[1:]
    full_path = os.path.join(base_directory, path)
    process = Thread(target=handle_stop_event, args=(full_path,))
    process.start()
    return Response("ok_message", status=200)
