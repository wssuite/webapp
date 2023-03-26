from flask import Blueprint, render_template

mod = Blueprint("index", __name__, url_prefix="/index")


@mod.route("/", methods=["GET"])
def index():
    return render_template('socketio.html')
