from flask import render_template
from . import index_mod as mod
from .. import socketio


@mod.route("/", methods=["GET"])
def index():
    socketio.emit("index", "triggered index controller")
    return render_template("socketio.html")
