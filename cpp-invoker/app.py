import os

from src.timer_thread import TimerThread
from src.controller import mod
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
        for key in on_going_requests.keys():
            counter = on_going_requests[key]
            if counter > 3:
                """TODO send the request to the main
                server with the status failed"""
                on_going_requests.pop(key)
            else:
                waiting_requests[key] = counter

        waiting_fm.write(waiting_requests)
    except OSError:
        running_fm.write({})
        waiting_fm.write({})
    except Exception:
        pass


if __name__ == "__main__":
    execute_before_server_start_up()
    """
    schedule a thread to see the running jobs
    and schedule new processes
    """
    thread = TimerThread(schedule_waiting)
    thread.start()
    port = int(os.getenv('PORT', '5000'))
    app.run(host="0.0.0.0", port=port)
