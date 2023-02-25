from src.dao.abstract_dao import connect_to_db
from src.dao.shift_group_dao import ShiftGroupDao
from flask import Blueprint, request, Response
from src.cpp_utils.shift_group import ShiftGroup
from constants import shift_group_name

mod = Blueprint('shift_group_controller',
                __name__,
                url_prefix="/shiftGroup")

shift_group_dao = ShiftGroupDao(connect_to_db())


@mod.route('/add', methods=['POST'])
def add_shift_group():
    shift_group_dict = request.json
    shift_group = ShiftGroup().from_json(shift_group_dict)
    shift_group_dao.insert_one_if_not_exist(
        shift_group.db_json()
    )
    return Response("OK", 200)


@mod.route("/fetchAll", methods=["GET"])
def get_all_shift_groups():
    return shift_group_dao.fetch_all_shift_groups()


@mod.route("/fetchByName", methods=["GET"])
def get_shift_group_by_name():
    name = request.args[shift_group_name]
    return shift_group_dao.find_shift_group_by_name(
        name
    )


@mod.route("/remove", methods=["DELETE"])
def remove_shift_group():
    name = request.args[shift_group_name]
    shift_group_dao.remove_shift_group(name)
    return Response("OK", 200)


@mod.route("/fetchAllNames", methods=["GET"])
def get_shift_groups_names():
    shift_groups = (shift_group_dao.
                    fetch_all_shift_groups())
    return [shift_group[shift_group_name]
            for shift_group in shift_groups]


@mod.route("/update", methods=["PUT"])
def update_shift_group():
    shift_group = request.json
    shift_group_dao.update_shift_group(shift_group)
    return Response("OK", 200)
