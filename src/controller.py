import multiprocessing
import os
import subprocess
import time

from flask import Blueprint, request, Response
import sys
from src.file_writer import FileManager

mod = Blueprint("controller", __name__, url_prefix="/solver")

base_directory = os.getcwd()


@mod.route("/test", methods=["POST"])
def test():
    try:
        return sys.argv[1]
    except IndexError:
        return request.host


def run_scheduler(path, fm, counter):
    """Get the current json from the fm"""
    data = fm.read()
    data[path] = counter
    fm.write(data)
    proc = subprocess.Popen(["sleep", "1m"])
    subprocess.Popen(["echo", f"{path}"])
    proc.wait()
    callback(path, fm)


def callback(path, fm):
    """
    TODO: the callback will launch a request to the ffs to inform
        it with the status of the schedule
    """
    try:
        data = fm.read()
        data.pop(path)
        fm.write(data)
    except Exception:
        time.sleep(1)
        callback(path, fm)


@mod.route("/schedule", methods=["POST"])
def schedule():
    path = request.args["path"]
    full_path = os.path.join(base_directory, path)
    fm = FileManager("running.json")
    process = multiprocessing.Process(target=run_scheduler,
                                      args=(full_path, fm, 1,))
    process.start()

    return Response("In Progress", status=200)
