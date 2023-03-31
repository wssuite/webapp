import json
import shutil
import requests
from .file_writer import FileManager
import os
import subprocess
import multiprocessing
from .protected_dict import ProtectedDict
import time


base_directory = os.getcwd()
running_dir = os.path.join(base_directory, 'running')
running_fm = FileManager(os.path.join(running_dir, 'running.json'))
waiting_fm = FileManager(os.path.join(running_dir, 'waiting.json'))

file = open("config.json")
data = json.load(file)
file.close()

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


def run_scheduler(path, counter):
    """
        TODO: launch a request to the ffs to update the status
            to In progress
        """
    info_json = extract_version_info_from_path(path)
    info_json["state"] = "In Progress"
    running_fm.add_item(path, counter)
    
    requests.post(
        f"http://{data['main_server_address']}/schedule/updateStatus",
        json=info_json
    )
    proc = subprocess.Popen(
        [
            "./bin/staticscheduler",
            "--dir",
            f"{path}/",
            "--instance",
            "sol",
            "--param",
            "default.txt",
            "--sol",
            f"{path}/",
            "--timeout",
            f"{data['timeout']}",
            "--origin",
            "ui"
        ]
    )
    proc.wait()
    print(proc.returncode)
    callback(path, proc.returncode)


def callback(path, status):
    """
    TODO: the callback will launch a request to the ffs to inform
        it with the status of the schedule
    """
    info_json = extract_version_info_from_path(path)
    try:
        shutil.move(
            os.path.join(path, "input.txt"),
            os.path.join(path, "sol.txt")
        )
    except Exception:
        pass

    if status == 0:
        """return success status"""
        info_json["state"] = "Success"
    else:
        """return Failed status"""
        info_json["state"] = "Failed"

    requests.post(
        f"http://{data['main_server_address']}/schedule/updateStatus",
        json=info_json
    )
    running_fm.pop_item_by_key(path)
    # print(rd)
    exit(0)


def schedule(full_path, counter):
    process = multiprocessing.Process(target=run_scheduler,
                                      args=(full_path, counter,))
    running_shared_dict.add_item(full_path, process)
    process.start()


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
