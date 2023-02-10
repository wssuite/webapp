from app import connect_to_db


class AbstractDao:
    mongo = connect_to_db()
    db = mongo.test
