from flask import Blueprint, request, Response
from src.dao.nurse_dao import NurseDao, Nurse
from src.dao.abstract_dao import DBConnection
from constants import nurse_username

mod = Blueprint("nurse_controller", __name__, url_prefix="/nurse")

nurse_dao = NurseDao(DBConnection.get_connection())


@mod.route("/add", methods=["POST"])
def add_nurse():
    nurse_dict = request.json
    nurse = Nurse().from_json(nurse_dict)
    return str(nurse_dao.insert_one(nurse.db_json()).inserted_id)


@mod.route("/fetchAll", methods=["GET"])
def get_all_nurses():
    return nurse_dao.fetch_all()


@mod.route("/fetchByUsername", methods=["GET"])
def get_nurse_by_username():
    username = request.args[nurse_username]
    return nurse_dao.find_by_username(username)


@mod.route("/remove", methods=["DELETE"])
def delete_nurse():
    username = request.args[nurse_username]
    nurse_dao.remove(username)
    return Response("OK", 200)


@mod.route("/fetchAllUsernames", methods=["GET"])
def get_nurses_usernames():
    all_nurses = nurse_dao.fetch_all()
    return [nurse[nurse_username] for nurse in all_nurses]


@mod.route("/update", methods=["PUT"])
def update_nurse():
    update_dict = request.json
    nurse = Nurse().from_json(update_dict)
    nurse_dao.update(nurse.db_json())
    return Response("OK", 200)
