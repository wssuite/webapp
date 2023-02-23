from flask import Blueprint, request
from src.dao.nurse_dao import NurseDao
from src.dao.abstract_dao import connect_to_db

mod = Blueprint("nurse_controller", __name__, url_prefix="/nurse")


nurse_dao = NurseDao(connect_to_db())


@mod.route("/add", methods=["POST"])
def register_nurse():
    nurse_dict = request.json
    return str(nurse_dao.insert_one(nurse_dict).inserted_id)


@mod.route("/fetchAll", methods=["GET"])
def fetch_all_nurses():
    return nurse_dao.fetch_all()
