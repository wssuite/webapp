import json
import requests

from src.file_writer import FileManager
import os
import subprocess
from src.protected_dict import ProtectedDict
from threading import Thread
import shlex
import sys

base_directory = os.getcwd()
running_dir = os.path.join(base_directory, 'running')
if not os.path.exists(running_dir):
    os.makedirs(running_dir)
running_fm = FileManager(os.path.join(running_dir, 'running.json'))
waiting_fm = FileManager(os.path.join(running_dir, 'waiting.json'))

file = open("config.json")
data = json.load(file)
API_ADDRESS = os.getenv("API_ADDRESS", data["api_address"])
TIMEOUT = os.getenv("TIMEOUT", data["timeout"])
CPP_PARAMS = os.getenv("CPP_PARAMS", data["cpp_params"])
file.close()
UPDATE_ENDPOINT = f"http://{API_ADDRESS}/schedule/updateStatus"

running_shared_dict = ProtectedDict()


def extract_version_info_from_path(path):
    separator = os.path.sep
    path_list = path.split(separator)
    info_json = {"version": path_list[-1]}
    start_end = path_list[-2].split("_")
    info_json["startDate"] = start_end[0]
    info_json["endDate"] = start_end[1]
    info_json["profile"] = path_list[-3]
    return info_json


def scheduler_wrapper(path, counter):
    info_json = extract_version_info_from_path(path)
    info_json["state"] = "In Progress"
    requests.post(UPDATE_ENDPOINT, json=info_json)

    status, out, err = run_scheduler(path, counter)
    try:
        str_err = err.decode()
        str_out = out.decode()
        error_file_path = os.path.join(path, "error.txt")
        with open(error_file_path, "w") as f:
            f.write(f"output: {str_out}\n")
            f.write("--------------------------------------------------------------------------------------\n")
            f.write(f"error: {str_err}")
    except Exception as e:
        print("No std error:", e)

    if status == 0:
        info_json["state"] = "Success"
    elif status == -1:
        info_json["state"] = "Stopped"
    else:
        info_json["state"] = "Failed"
    print("Scheduler finished with status", info_json["state"], "for path", path)
    requests.post(UPDATE_ENDPOINT, json=info_json)

    exit(0)


def run_scheduler(path, counter):
    running_fm.add_item(path, counter)

    cmd = (
        "./bin/staticscheduler --dir {0}/ --instance input.txt --param {1} "
        "--sol {0} --timeout {2} --origin ui".format(
            path, CPP_PARAMS, TIMEOUT)
    )
    cmd_split = shlex.split(cmd)
    print(cmd_split)

    proc = subprocess.Popen(
        cmd_split, stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    running_shared_dict.add_item(path, proc)
    out, err = proc.communicate()
    p = running_shared_dict.pop_item(path)

    running_fm.pop_item_by_key(path)
    # if the item has already been popped by the stop event
    return -1 if p is None else proc.returncode, out, err


def schedule(full_path, counter):
    process = Thread(target=scheduler_wrapper, args=(full_path, counter,))
    process.start()
    return process


def add_to_waiting(key, value):
    waiting_fm.add_item(key, value)


def pop_from_waiting():
    return waiting_fm.pop_first_item()


def schedule_waiting():
    running_data = running_fm.read()
    if len(running_data.keys()) < int(data["max_nb_processes"]):
        item = pop_from_waiting()
        if item is not None:
            print("new item scheduled")
            schedule(item[0], item[1])


def handle_stop_event(full_path):
    """Delete the element from the running map"""
    proc = running_shared_dict.pop_item(full_path)
    if proc:
        print("Terminate process:", full_path)
        proc.terminate()


if __name__ == "__main__":
    import time
    schedule(sys.argv[1], 0)
    time.sleep(3)
    handle_stop_event(sys.argv[1])
