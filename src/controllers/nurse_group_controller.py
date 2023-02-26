from flask import Blueprint, request, Response
from src.dao.nurse_group_dao import (
    NurseGroupDao,
    NurseGroup
)
from src.dao.abstract_dao import connect_to_db
from constants import nurse_group_name

mod = Blueprint("nurse_group_controller",
                __name__,
                url_prefix="/nurseGroup")

nurse_group_dao = NurseGroupDao(
    connect_to_db())


@mod.route("/add", methods=["POST"])
def add_nurse_group():
    nurse_group_dict = request.json
    group = NurseGroup().from_json(nurse_group_dict)
    nurse_group_dao.insert_one_if_not_exist(
        group.to_json()
    )
    return Response("OK", 200)


@mod.route("/fetchAll", methods=["GET"])
def get_all_nurse_groups():
    return nurse_group_dao.fetch_all()


@mod.route("/fetchByName", methods=["GET"])
def get_nurse_group_by_name():
    name = request.args[nurse_group_name]
    return nurse_group_dao.find_by_name(
        name
    )


@mod.route("/remove", methods=["DELETE"])
def delete_nurse():
    name = request.args[nurse_group_name]
    nurse_group_dao.remove(name)
    return Response("OK", 200)


@mod.route("/fetchAllNames", methods=["GET"])
def get_nurses_usernames():
    all_groups = nurse_group_dao.fetch_all()
    return [nurse_group[nurse_group_name]
            for nurse_group in all_groups]


@mod.route("/update", methods=["PUT"])
def update_nurse():
    update_dict = request.json
    nurse_group = NurseGroup().from_json(
        update_dict)
    nurse_group_dao.update(
        nurse_group.db_json())
    return Response("OK", 200)
