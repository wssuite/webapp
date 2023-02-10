from pymongo import MongoClient


def connect_to_db():
    return MongoClient('localhost', 27017)


class AbstractDao:
    mongo = connect_to_db()
    db = mongo.test
