from src.dao.abstract_dao import DBConnection
from src.dao.shift_dao import ShiftDao
from flask import Blueprint, request, Response
from src.models.shift import Shift
from constants import shift_name

mod = Blueprint("shift_controller", __name__, url_prefix="/shift")

shift_dao = ShiftDao(DBConnection.get_connection())


@mod.route("/add", methods=["POST"])
def add_shift():
    shift_dict = request.json
    shift = Shift().from_json(shift_dict)
    shift_dao.insert_one_if_not_exist(shift.db_json())
    return Response("OK", 200)


@mod.route("/fetchAll", methods=["GET"])
def get_all_shifts():
    return shift_dao.fetch_all()


@mod.route("/fetchByName", methods=["GET"])
def get_shift_by_name():
    name = request.args[shift_name]
    return shift_dao.find_by_name(name)


@mod.route("/remove", methods=["DELETE"])
def remove_shift():
    name = request.args[shift_name]
    shift_dao.remove(name)
    return Response("OK", 200)


@mod.route("/fetchAllNames", methods=["GET"])
def get_shifts_names():
    shifts = shift_dao.fetch_all()
    return [shift[shift_name] for shift in shifts]


@mod.route("/update", methods=["PUT"])
def update_shift():
    shift_dict = request.json
    shift = Shift().from_json(shift_dict)
    shift_dao.update(shift.db_json())
    return Response("OK", 200)
