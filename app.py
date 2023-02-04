from flask import Flask

from src.controllers import index
app = Flask(__name__)

app.register_blueprint(index.mod)
if __name__ == "__main__":
    app.run(host='0.0.0.0')
