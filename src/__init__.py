from flask import Flask
from src.controllers import (
    schedule_controller,
    nurse_controller,
    nurse_group_controller,
    shift_controller,
    shift_type_controller,
    shift_group_controller,
    contract_controller,
    user_controller,
    skill_controller,
    profile_controller,
    contract_group_controller,
)
from flask_cors import CORS
from flask_socketio import SocketIO

socketio = SocketIO()


def create_app():
    flask_app = Flask(__name__)
    cors = CORS()
    cors.init_app(
        flask_app, resources={r"*": {"origins": "*", "allowed_headers": "*"}}
    )

    from src.controllers.index import mod as mod1

    flask_app.register_blueprint(mod1)
    flask_app.register_blueprint(schedule_controller.mod)
    flask_app.register_blueprint(nurse_controller.mod)
    flask_app.register_blueprint(nurse_group_controller.mod)
    flask_app.register_blueprint(shift_controller.mod)
    flask_app.register_blueprint(shift_type_controller.mod)
    flask_app.register_blueprint(shift_group_controller.mod)
    flask_app.register_blueprint(contract_controller.mod)
    flask_app.register_blueprint(contract_group_controller.mod)
    flask_app.register_blueprint(user_controller.mod)
    flask_app.register_blueprint(skill_controller.mod)
    flask_app.register_blueprint(profile_controller.mod)
    socketio.init_app(flask_app)
    return flask_app
