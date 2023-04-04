import pymongo
import mongomock
import json

"""
    We need to connect to the ip address of the container that
    is hosting mongodb

    Verify the docker compose to know that public IP
"""


def connect_to_db():
    file = open("config.json")
    data = json.load(file)
    file.close()
    return pymongo.MongoClient(data["mongo_address"], 27017)


def connect_to_fake_db():
    return mongomock.MongoClient()


class DBConnection:
    connection = None

    @staticmethod
    def get_connection():
        if DBConnection.connection is None:
            DBConnection.connection = connect_to_db()
        return DBConnection.connection


class AbstractDao:
    def __init__(self, mongo):
        self.db = mongo.test
