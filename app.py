from flask import Flask
from src.controllers import index
from src.controllers import (
    schedule_controller,
    nurse_controller,
    nurse_group_controller)
import config
from flask_cors import CORS


def create_app():
    flask_app = Flask(__name__)
    cors = CORS()
    cors.init_app(flask_app,
                  resources={r"*": {"origins": "*", "allowed_headers": "*"}})
    flask_app.register_blueprint(index.mod)
    flask_app.register_blueprint(schedule_controller.mod)
    flask_app.register_blueprint(nurse_controller.mod)
    flask_app.register_blueprint(nurse_group_controller.mod)
    return flask_app


def test_client():
    flask_app = create_app()
    flask_app.config.from_object(config.TestingConfig)
    return flask_app.test_client()


if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0')
