from src.models.jsonify import Jsonify
from src.models.db_document import DBDocument
from pykson import StringField
from constants import user_token, user_password, user_username, empty_token


class User(Jsonify, DBDocument):
    username = StringField(serialized_name=user_username, default_value="")
    password = StringField(serialized_name=user_password, default_value="")
    token = StringField(serialized_name=user_token, default_value=empty_token)

    def db_json(self) -> dict:
        return self.to_json()
