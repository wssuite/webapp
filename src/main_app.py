from flask import Flask

from views import index
app = Flask(__name__)

app.register_blueprint(index.mod)
