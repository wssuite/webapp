from flask import Flask
from src.controllers import index
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
)
import config
from flask_cors import CORS
from src.dao.user_dao import UserDao
from test_constants import default_user, work_shift_group, rest_shift_group
from src.dao.abstract_dao import DBConnection
from constants import admin, user_password, utf8, work, rest
from src.models.user import User
import bcrypt
from src.dao.shift_group_dao import ShiftGroupDao, ShiftGroup


def create_app():
    flask_app = Flask(__name__)
    cors = CORS()
    cors.init_app(
        flask_app, resources={r"*": {"origins": "*", "allowed_headers": "*"}}
    )

    flask_app.register_blueprint(index.mod)
    flask_app.register_blueprint(schedule_controller.mod)
    flask_app.register_blueprint(nurse_controller.mod)
    flask_app.register_blueprint(nurse_group_controller.mod)
    flask_app.register_blueprint(shift_controller.mod)
    flask_app.register_blueprint(shift_type_controller.mod)
    flask_app.register_blueprint(shift_group_controller.mod)
    flask_app.register_blueprint(contract_controller.mod)
    flask_app.register_blueprint(user_controller.mod)
    flask_app.register_blueprint(skill_controller.mod)
    return flask_app


def test_client():
    flask_app = create_app()
    flask_app.config.from_object(config.TestingConfig)
    return flask_app.test_client()


if __name__ == "__main__":
    db_connection = DBConnection.get_connection()
    app = create_app()
    user_dao = UserDao(db_connection)
    admin_dict = user_dao.find_by_username(admin)
    if admin_dict is None:
        admin_user = User().from_json(default_user)
        db_json = admin_user.db_json()
        password = db_json[user_password].encode(utf8)
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password, salt)
        db_json[user_password] = hashed_password
        user_dao.insert_one(db_json)

    shift_group_dao = ShiftGroupDao(db_connection)
    work_group = shift_group_dao.find_by_name(work)
    rest_group = shift_group_dao.find_by_name(rest)
    if work_group is None:
        w_group = ShiftGroup().from_json(work_shift_group)
        shift_group_dao.insert_one_if_not_exist(w_group.db_json())

    if rest_group is None:
        r_group = ShiftGroup().from_json(rest_shift_group)
        shift_group_dao.insert_one_if_not_exist(r_group.db_json())

    app.run(host="0.0.0.0")
