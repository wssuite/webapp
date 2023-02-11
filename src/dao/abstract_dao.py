import pymongo
import mongomock


def connect_to_db():
    return pymongo.MongoClient('localhost', 27017)


def connect_to_fake_db():
    return mongomock.MongoClient()


class AbstractDao:

    def __init__(self, mongo):
        self.db = mongo.test
