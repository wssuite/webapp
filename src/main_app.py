from flask import Flask

from controllers import index
app = Flask(__name__)

app.register_blueprint(index.mod)
