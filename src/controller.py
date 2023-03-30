import os

import requests

from .handler import (
    add_to_waiting,
    base_directory,
    running_shared_dict,
    extract_version_info_from_path,
    data
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
    """Delete the element from the running map"""
    process = running_shared_dict.pop_item(full_path)
    process.terminate()
    info_json = extract_version_info_from_path(full_path)
    info_json["state"] = "Stopped"
    requests.post(
        f"http://{data['main_server_address']}/schedule/updateStatus",
        json=info_json
    )

    return Response("ok_message", status=200)
