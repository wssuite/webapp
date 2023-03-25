import multiprocessing

from src.controller import mod, run_scheduler
from flask import Flask
from src.file_writer import FileManager

app = Flask(__name__)


@app.route("/", methods=["GET"])
def status():
    return "Hello World"


app.register_blueprint(mod)


def execute_before_server_start_up():
    """Read running json file and get the info of the running requests"""
    try:
        fm = FileManager("running.json")
        on_going_requests: dict = fm.read()
        fm.write({})

        """Restart the failed jobs"""
        for key in on_going_requests.keys():
            counter = on_going_requests[key]
            if counter > 3:
                """TODO send the request to the main
                server with the status failed"""
                on_going_requests.pop(key)
            else:
                process = multiprocessing.Process(
                    target=run_scheduler, args=(key, fm, counter + 1,))
                process.start()

    except Exception:
        pass


if __name__ == "__main__":
    execute_before_server_start_up()
    app.run(host="0.0.0.0")
