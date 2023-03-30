import requests

from .file_writer import FileManager
import os
import subprocess
import multiprocessing
import sys

base_directory = os.getcwd()
running_dir = os.path.join(base_directory, 'running')
running_fm = FileManager(os.path.join(running_dir, 'running.json'))
waiting_fm = FileManager(os.path.join(running_dir, 'waiting.json'))


def extract_version_info_from_path(path):
    separator = os.path.sep
    path_list = path.split(separator)
    json = {"version": path_list[-1]}
    start_end = path_list[-2].split("_")
    json["startDate"] = start_end[0]
    json["endDate"] = start_end[1]
    json["profile"] = path_list[-3]
    return json


def run_scheduler(path, counter):
    """
        TODO: launch a request to the ffs to update the status
            to In progress
        """
    json = extract_version_info_from_path(path)
    json["state"] = "In Progress"
    requests.post(
        f"http://{sys.argv[3]}/schedule/updateStatus",
        json=json
    )
    running_fm.add_item(path, counter)
    input_file_path = os.path.join(path, "input.json")
    proc = subprocess.Popen(["sleep", "2m"])
    subprocess.Popen(["cat", f"{input_file_path}"])
    proc.wait()
    print(proc.returncode)
    callback(path, proc.returncode)


def callback(path, status):
    """
    TODO: the callback will launch a request to the ffs to inform
        it with the status of the schedule
    """
    json = extract_version_info_from_path(path)
    if status == 0:
        """return success status"""
        json["state"] = "Success"
    else:
        """return Failed status"""
        json["state"] = "Success"

    requests.post(
        f"http://{sys.argv[3]}/schedule/updateStatus",
        json=json
    )
    running_fm.pop_item_by_key(path)
    # print(rd)
    exit(0)


def schedule(full_path, counter):
    process = multiprocessing.Process(target=run_scheduler,
                                      args=(full_path, counter,))
    process.start()


def add_to_waiting(key, value):
    waiting_fm.add_item(key, value)


def pop_from_waiting():
    return waiting_fm.pop_first_item()


def schedule_waiting():
    data = running_fm.read()
    if len(data.keys()) < int(sys.argv[2]):
        item = pop_from_waiting()
        if item is not None:
            print("new item scheduled")
            schedule(item[0], item[1])
