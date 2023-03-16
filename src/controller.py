from flask import Blueprint
import sys
mod = Blueprint("controller", __name__, url_prefix="/solver")


@mod.route("/test", methods=["POST"])
def test():
    return sys.argv[1]
