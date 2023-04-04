from pymongo.collection import Collection
from constants import (
    user_username,
    mongo_id_field,
    mongo_set_operation,
    user_token,
)
from src.dao.abstract_dao import AbstractDao


class UserDao(AbstractDao):
    def __init__(self, mongo):
        super().__init__(mongo)
        self.collection: Collection = self.db.users

    def find_by_username(self, username):
        return self.collection.find_one(
            {user_username: username}, {mongo_id_field: 0}
        )

    def insert_one(self, user: dict):
        self.collection.insert_one(user)

    def update(self, user: dict):
        self.collection.find_one_and_update(
            {user_username: user[user_username]}, {mongo_set_operation: user}
        )

    def remove(self, username):
        self.collection.find_one_and_delete({user_username: username})

    def find_by_token(self, token):
        return self.collection.find_one(
            {user_token: token}, {mongo_id_field: 0}
        )

    def fetch_all_usernames(self):
        cursor = self.collection.find(
            {}, {mongo_id_field: 0, user_username: 1}
        )
        return [username for username in cursor]
