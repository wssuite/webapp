from src.controller import mod
from flask import Flask

app = Flask(__name__)
app.register_blueprint(mod)
app.run(host="0.0.0.0")
