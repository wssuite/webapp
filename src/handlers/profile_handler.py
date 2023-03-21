from werkzeug.datastructures import FileStorage
from src.handlers.base_handler import BaseHandler
from src.importers.importer import CSVImporter
from src.models.profile import Profile, DetailedProfile
from constants import (
    user_username,
    work_shift_group,
    profile,
    rest_shift_group,
    work,
    rest,
)
from src.models.shift_group import ShiftGroup
from src.utils.file_system_manager import FileSystemManager
import os


class ProfileHandler(BaseHandler):
    def __init__(self, mongo):
        super().__init__(mongo)

    def create_profile(self, token, profile_name):
        user = self.verify_token(token)
        fs = FileSystemManager()

        profile_object = Profile()
        profile_object.name = profile_name
        profile_object.creator = user[user_username]
        profile_object.access = [user[user_username]]
        self.profile_dao.insert_if_not_exist(profile_object.db_json())
        profile_path = f"{fs.get_dataset_directory_path()}/{profile_name}"
        fs.create_dir_if_not_exist(profile_path)
        w_group_dict = work_shift_group.copy()
        w_group_dict[profile] = profile_name
        w_group = ShiftGroup().from_json(w_group_dict)
        self.shift_group_dao.insert_one_if_not_exist(w_group.db_json())
        r_group_dict = rest_shift_group.copy()
        r_group_dict[profile] = profile_name
        r_group = ShiftGroup().from_json(r_group_dict)
        self.shift_group_dao.insert_one_if_not_exist(r_group.db_json())

    def get_all_profiles(self, token):
        user = self.verify_token(token)
        return self.profile_dao.fetch_all_with_user_access(user[user_username])

    def delete_profile(self, token, name):
        self.verify_profile_creator_access(token, name)
        fs = FileSystemManager()
        self.profile_dao.remove(name)
        self.shift_dao.delete_all(name)
        self.skill_dao.delete_all(name)
        self.shift_type_dao.delete_all(name)
        self.shift_group_dao.delete_all(name)
        self.contract_dao.delete_all(name)
        self.nurse_dao.delete_all(name)
        self.nurse_group_dao.delete_all(name)
        self.contract_group_dao.delete_all(name)
        profile_path = f"{fs.get_dataset_directory_path()}/{name}"
        fs.delete_dir(profile_path)

    """
    When duplicating a profile, we want to duplicate the work
    and rest groups as is. Therefore, we must delete the default
    shift groups created when the new profile is created
    """

    def duplicate(self, token, name, other_name):
        self.verify_profile_accessors_access(token, name)
        self.create_profile(token, other_name)
        self.shift_group_dao.remove(work, other_name)
        self.shift_group_dao.remove(rest, other_name)
        self.shift_dao.duplicate(name, other_name)
        self.skill_dao.duplicate(name, other_name)
        self.shift_type_dao.duplicate(name, other_name)
        self.shift_group_dao.duplicate(name, other_name)
        self.contract_dao.duplicate(name, other_name)
        self.nurse_dao.duplicate(name, other_name)
        self.nurse_group_dao.duplicate(name, other_name)
        self.contract_group_dao.duplicate(name, other_name)

    def share(self, token, name, other_user):
        self.verify_profile_accessors_access(token, name)
        self.profile_dao.add_access_to_user(name, other_user)

    def revoke_access(self, token, name, user):
        self.verify_profile_accessors_access(token, name)
        self.profile_dao.remove_access_from_user(name, user)

    def get_accessors_list(self, token, name):
        self.verify_profile_accessors_access(token, name)
        return self.profile_dao.get_accessors_list(name)

    def import_file(self, token, file: FileStorage):
        self.verify_token(token)
        file.save(file.filename)
        file_path = file.filename
        profile_json = CSVImporter().read_file(file_name=file_path)
        os.remove(file_path)
        return profile_json

    def save_import(self, token, json):
        d_p = DetailedProfile().from_json(json)
        self.create_profile(token, d_p.name)
        for skill in d_p.skills:
            self.skill_dao.insert_one_if_not_exist(skill.db_json())
        for shift in d_p.shifts:
            self.shift_dao.insert_one_if_not_exist(shift.db_json())
            self.shift_group_dao.add_shift_to_shift_group_list(
                work, shift.name, d_p.name
            )
        for shift_type in d_p.shift_types:
            self.shift_type_dao.insert_one_if_not_exist(shift_type.db_json())
            self.shift_group_dao.add_shift_type_to_shift_group_list(
                work, shift_type.name, d_p.name
            )

        for shift_group in d_p.shift_groups:
            if shift_group.name != work and shift_group.name != rest:
                self.shift_group_dao.insert_one_if_not_exist(
                    shift_group.db_json()
                )

        for contract in d_p.contracts:
            self.contract_dao.insert_one(contract.db_json())

        for contract_group in d_p.contract_groups:
            self.contract_group_dao.insert_if_not_exist(
                contract_group.db_json()
            )

        for nurse in d_p.nurses:
            self.nurse_dao.insert_one(nurse.db_json())
        for nurse_group in d_p.nurse_groups:
            self.nurse_group_dao.insert_one_if_not_exist(nurse_group.db_json())
