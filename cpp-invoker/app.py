import os

from src.timer_thread import TimerThread
from src.controller import mod, PORT
from flask import Flask
from src.handler import (
    running_fm,
    waiting_fm,
    schedule_waiting,
)

app = Flask(__name__)


@app.route("/", methods=["GET"])
def status():
    return "Hello World"


app.register_blueprint(mod)


def execute_before_server_start_up():
    """Read running json file and get the info of the running requests"""
    try:
        on_going_requests: dict = running_fm.read()
        running_fm.write({})
        waiting_requests: dict = waiting_fm.read()

        """Restart the failed jobs"""
        for key, config in on_going_requests.items():
            if config["retry"] > 3:
                """TODO send the request to the main
                server with the status failed"""
                pass
            else:
                config["retry"] += 1
                waiting_requests[key] = config

        waiting_fm.write(waiting_requests)
    except OSError:
        running_fm.write({})
        waiting_fm.write({})
    except Exception as e:
        print(e)


if __name__ == "__main__":
    execute_before_server_start_up()
    """
    schedule a thread to see the running jobs
    and schedule new processes
    """
    thread = TimerThread(schedule_waiting)
    thread.start()
    app.run(host="0.0.0.0", port=PORT)
