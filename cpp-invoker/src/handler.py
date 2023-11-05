import time
import glob
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

API_ADDRESS = os.getenv("API_ADDRESS", "api:5000")
TIMEOUT = int(os.getenv("TIMEOUT", "1800"))
MAX_THREADS = int(os.getenv("MAX_THREADS", "4"))
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


def get_full_path(path):
    if path[0] == "/":
        path = path[1:]
    return os.path.join(base_directory, path)


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


def run_scheduler(path, config):
    if "retry" not in config:
        config["retry"] = 0
    else:
        config["retry"] += 1
    running_fm.add_item(path, config)

    cmd = (
        "./bin/staticscheduler --dir {0}/ --instance input.txt "
        "--sol {0} --timeout {1} --n-threads {2} --origin ui".format(
            path, config["timeout"], config["threads"])
    )
    if "param" in config and config["param"] != "default":
        param = config["param"].replace(" ", "_")
        cmd += f" --param ./params/{param}.txt"
    cmd_split = shlex.split(cmd)
    print("Run command:", cmd_split)

    proc = subprocess.Popen(
        cmd_split, stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    running_shared_dict.add_item(path, proc)
    out, err = proc.communicate()
    p = running_shared_dict.pop_item(path)

    running_fm.pop_item_by_key(path)
    # if the item has already been popped by the stop event
    return -1 if p is None else proc.returncode, out, err


def schedule(full_path, config):
    process = Thread(target=scheduler_wrapper, args=(full_path, config,))
    process.start()
    return process


def add_to_waiting(key, value):
    waiting_fm.add_item(key, value)


def pop_from_waiting():
    return waiting_fm.pop_first_item()


def schedule_waiting():
    running_data = running_fm.read()
    nThreads = sum(d["threads"] for d in running_data.values())
    if nThreads < MAX_THREADS:
        path, config = pop_from_waiting()
        if path is not None:
            if config["threads"] + nThreads <= MAX_THREADS:
                print("new item scheduled")
                schedule(path, config)
            else:
                add_to_waiting(path, config)


def handle_schedule(request):
    full_path = get_full_path(request.get("path"))
    config = {
        "timeout": request.get("timeout", TIMEOUT),
        "threads": int(request.get("threads", 1 if MAX_THREADS <= 1 else 2))
    }
    if "param" in request:
        config["param"] = request.get("param")
        if "mip" in config["param"] and config["threads"] <= 1:
            config["threads"] = 2  # needs at least 2 threads to run the mip params
    add_to_waiting(full_path, config)


def kill_process(full_path, wait_for=0):
    proc = running_shared_dict.pop_item(full_path)
    if proc:
        print("Terminate process:", full_path)
        proc.terminate()
        time.sleep(wait_for)
        if proc.returncode is None:
            print("Kill process:", full_path)
            proc.kill()
            info_json = extract_version_info_from_path(full_path)
            info_json["state"] = "Stopped"
            print("Scheduler finished with status", info_json["state"], "for path", full_path)
            requests.post(UPDATE_ENDPOINT, json=info_json)



def handle_stop_event(path):
    """Delete the element from the running map"""
    full_path = get_full_path(path)
    print("Try to stop process associated to", full_path)
    print("Current paths with active processes:", list(running_shared_dict.keys()))
    process = Thread(target=kill_process, args=(full_path, 5,))
    process.start()


def possible_configs():
    param_files = glob.glob('./params/*.txt')
    params_list = [p.rsplit("/", 1)[-1][:-4].replace("_", " ") for p in param_files]
    if MAX_THREADS < 2:
        # remove mip param files
        params_list = [p for p in params_list if "mip" not in p]
    return {
        "params": ["default"] + sorted(params_list),
        "defaultTimeout": TIMEOUT,
        "maxThreads": MAX_THREADS
    }


if __name__ == "__main__":
    schedule(sys.argv[1], {
        "timeout": TIMEOUT,
        "threads": 1 if MAX_THREADS <= 1 else 2
    })
    time.sleep(3)
    handle_stop_event(sys.argv[1])
