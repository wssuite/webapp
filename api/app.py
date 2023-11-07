import os
import config
from src import create_app, socketio
from src.dao.user_dao import UserDao
from test_constants import default_user
from src.dao.abstract_dao import DBConnection
from constants import admin, user_username, user_password, utf8
from src.models.user import User
import bcrypt


def test_client():
    flask_app = create_app()
    flask_app.config.from_object(config.TestingConfig)
    return flask_app.test_client()


if __name__ == "__main__":
    db_connection = DBConnection.get_connection()
    user_dao = UserDao(db_connection)
    app = create_app()
    admin_dict = user_dao.find_by_username(admin)
    if admin_dict is None:
        print("Create default admin user")
        default_user = {
            user_password: os.getenv(user_password, default_user[user_password]),
            user_username: os.getenv(user_username, default_user[user_username])
        }
        admin_user = User().from_json(default_user)
        db_json = admin_user.db_json()
        password = db_json[user_password].encode(utf8)
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password, salt)
        db_json[user_password] = hashed_password
        user_dao.insert_one(db_json)
    socketio.run(app, host="0.0.0.0", debug=True)
