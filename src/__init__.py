from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO

socketio = SocketIO(logger=True)


def create_app():
    flask_app = Flask(__name__)
    cors = CORS()
    cors.init_app(
        flask_app, resources={r"*": {"origins": "*", "allowed_headers": "*"}}
    )

    from .controllers import (
        index_mod,
        schedule_mod,
        nurse_mod,
        nurse_group_mod,
        skill_mod,
        shift_mod,
        shift_group_mod,
        shift_type_mod,
        contract_mod,
        contract_group_mod,
        profile_mod,
        user_mod,
    )

    flask_app.register_blueprint(index_mod)

    flask_app.register_blueprint(schedule_mod)
    flask_app.register_blueprint(nurse_mod)
    flask_app.register_blueprint(nurse_group_mod)
    flask_app.register_blueprint(shift_mod)
    flask_app.register_blueprint(shift_type_mod)
    flask_app.register_blueprint(shift_group_mod)
    flask_app.register_blueprint(contract_mod)
    flask_app.register_blueprint(contract_group_mod)
    flask_app.register_blueprint(user_mod)
    flask_app.register_blueprint(skill_mod)
    flask_app.register_blueprint(profile_mod)

    socketio.init_app(flask_app)
    return flask_app
