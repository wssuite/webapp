import sys
import os
from threading import Thread
from .handler import (
    handle_schedule,
    handle_stop_event,
    possible_configs
)
from flask import Blueprint, request


HOSTNAME = os.uname().nodename
PORT = int(os.getenv('PORT', '5000'))
HOST = f"{HOSTNAME}:{PORT}"


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
    return HOST


@mod.route("/stop", methods=["GET", "POST"])
def stop():
    handle_stop_event(request.args["path"])
    return "ok_message"


@mod.route("/config", methods=["GET", "POST"])
def params():
    return possible_configs()
