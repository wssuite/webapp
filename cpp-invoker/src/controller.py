import sys
from threading import Thread

from .handler import (
    handle_schedule,
    handle_stop_event,
    possible_configs
)

from flask import Blueprint, request

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
    return request.host


@mod.route("/stop", methods=["GET", "POST"])
def stop():
    process = Thread(target=handle_stop_event, args=(request.args["path"],))
    process.start()
    return "ok_message"


@mod.route("/config", methods=["GET", "POST"])
def params():
    return possible_configs()
