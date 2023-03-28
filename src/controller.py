import os
from .handler import add_to_waiting, base_directory

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
    print(path)
    full_path = os.path.join(base_directory, path)
    print(full_path)
    add_to_waiting(full_path, 1)
    return Response(sys.argv[1], status=200)
