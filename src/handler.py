from .file_writer import FileManager
import os
import subprocess
import multiprocessing
import sys

base_directory = os.getcwd()
running_dir = os.path.join(base_directory, 'running')
running_fm = FileManager(os.path.join(running_dir, 'running.json'))
waiting_fm = FileManager(os.path.join(running_dir, 'waiting.json'))
running_dict = {}


def run_scheduler(path, counter):
    """
        TODO: launch a request to the ffs to update the status
            to In progress
        """
    running_fm.add_item(path, counter)
    input_file_path = os.path.join(path, "input.json")
    subprocess.Popen(["sleep", "1m"])
    proc = subprocess.Popen(["cat", f"{input_file_path}"])
    proc.wait()
    print(proc.returncode)
    callback(path, proc.returncode)


def callback(path, status):
    """
    TODO: the callback will launch a request to the ffs to inform
        it with the status of the schedule
    """
    if status == 0:
        """return success status"""
    else:
        """return Failed status"""
    running_fm.pop_item_by_key(path)


def schedule(full_path, counter):
    process = multiprocessing.Process(target=run_scheduler,
                                      args=(full_path, counter, ))
    process.start()
    return process


def add_to_waiting(key, value):
    waiting_fm.add_item(key, value)


def pop_from_waiting():
    return waiting_fm.pop_first_item()


def schedule_waiting():
    if len(running_dict) < int(sys.argv[2]):
        item = pop_from_waiting()
        if item is not None:
            process = schedule(item[0], item[1])
            running_dict[item[0]] = process
