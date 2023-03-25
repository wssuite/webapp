import multiprocessing
import subprocess

from flask import Blueprint, request, Response
import sys

mod = Blueprint("controller", __name__, url_prefix="/solver")


@mod.route("/test", methods=["POST"])
def test():
    try:
        return sys.argv[1]
    except IndexError:
        return request.host


def run_scheduler():
    """
    TODO Before invoking the C++ code add the new entry to the persistent file
    TODO Change the call with popen to invoke the c++ code
    """
    proc = subprocess.Popen(["sleep", "1m"])
    proc.wait()
    callback()
    exit(0)


def callback():
    """
    TODO: the callback will launch a request to the ffs to inform
        it with the status of the schedule
    """
    print("Callback")


@mod.route("/schedule", methods=["POST"])
def run_schedule():
    thread = multiprocessing.Process(target=run_scheduler)
    thread.start()

    return Response("In Progress", status=200)
