from src.exceptions.project_base_exception import ProjectBaseException
from src.handlers.profile_handler import ProfileHandler
from src.dao.abstract_dao import DBConnection
from flask import Blueprint, Response, request
from constants import (
    ok_message,
    user_token,
    profile,
    user_username,
    duplicate_name,
)

mod = Blueprint("profile_controller", __name__, url_prefix="/profile")

profile_handler = ProfileHandler(DBConnection.get_connection())


@mod.route("/createEmpty", methods=["POST"])
def create_empty():
    try:
        profile_name = request.args[profile]
        token = request.args[user_token]
        profile_handler.create_profile(token, profile_name)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchAll", methods=["GET"])
def get_all_profiles():
    try:
        token = request.args[user_token]
        return profile_handler.get_all_profiles(token)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/delete", methods=["DELETE"])
def delete_profile():
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        profile_handler.delete_profile(token, profile_name)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/duplicate", methods=["POST"])
def duplicate_profile():
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        other_profile_name = request.args[duplicate_name]
        profile_handler.duplicate(token, profile_name, other_profile_name)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/share", methods=["PUT"])
def share_profile():
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        user = request.json
        profile_handler.share(token, profile_name, user)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/revokeAccess", methods=["PUT"])
def revoke_access():
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        user = request.args[user_username]
        profile_handler.revoke_access(token, profile_name, user)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/fetchAllAccessors", methods=["GET"])
def get_accessors():
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        return profile_handler.get_accessors_list(token, profile_name)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/import", methods=["POST"])
def import_file():
    try:
        token = request.args[user_token]
        file = request.files["file"]
        return profile_handler.import_file(token, file)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/saveImport", methods=["POST"])
def save_import_profile():
    try:
        token = request.args[user_token]
        json = request.json
        profile_handler.save_import(token, json)
        return Response(ok_message, 200)
    except ProjectBaseException as e:
        return Response(e.args, 500)


@mod.route("/export", methods=["GET"])
def export_profile():
    try:
        token = request.args[user_token]
        profile_name = request.args[profile]
        export_str = profile_handler.export_profile(token, profile_name)
        return Response(
            export_str,
            mimetype="text/csv",
            headers={
                "Content-disposition": f"attachment; filename="
                f"{profile_name}.csv"
            },
        )
    except ProjectBaseException as e:
        return Response(e.args, 500)
