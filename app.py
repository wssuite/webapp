from src.controller import mod
from flask import Flask

app = Flask(__name__)


@app.route("/", methods=["GET"])
def status():
    return "Hello World"


app.register_blueprint(mod)
app.run(host="0.0.0.0")
