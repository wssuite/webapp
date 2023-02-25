from src.dao.abstract_dao import connect_to_db
from src.dao.shift_type_dao import ShiftTypeDao
from flask import Blueprint, request, Response
from src.cpp_utils.shift_type import ShiftType
from constants import shift_type_name

mod = Blueprint('shift_type_controller',
                __name__,
                url_prefix="/shiftType")

shift_type_dao = ShiftTypeDao(connect_to_db())


@mod.route('/add', methods=['POST'])
def add_shift_type():
    shift_type_dict = request.json
    shift_type = ShiftType().from_json(shift_type_dict)
    shift_type_dao.insert_one_if_not_exist(
        shift_type.db_json()
    )
    return Response("OK", 200)


@mod.route("/fetchAll", methods=["GET"])
def get_all_shift_types():
    return shift_type_dao.fetch_all_shift_types()


@mod.route("/fetchByName", methods=["GET"])
def get_shift_type_by_name():
    name = request.args[shift_type_name]
    return shift_type_dao.find_shift_type_by_name(
        name
    )


@mod.route("/remove", methods=["DELETE"])
def remove_shift_type():
    name = request.args[shift_type_name]
    shift_type_dao.remove_shift_type(name)
    return Response("OK", 200)


@mod.route("/fetchAllNames", methods=["GET"])
def get_shift_types_names():
    shift_types = shift_type_dao.fetch_all_shift_types()
    return [shift_type[shift_type_name]
            for shift_type in shift_types]


@mod.route("/update", methods=["PUT"])
def update_shift_type():
    shift_type = request.json
    shift_type_dao.update_shift_type(shift_type)
    return Response("OK", 200)
