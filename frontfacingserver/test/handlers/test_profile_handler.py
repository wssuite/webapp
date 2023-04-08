from src.exceptions.project_base_exception import ProjectBaseException
from src.dao.abstract_dao import connect_to_fake_db
from src.handlers.profile_handler import ProfileHandler
from test_constants import (
    profile1,
    default_user,
    random_hex,
    user1,
    random_hex2,
    test_profile,
    profile_access,
    user1_name,
    admin,
    nurse_skill,
    head_nurse_skill,
    sociologist_skill,
    early_shift,
    late_shift,
    day_shift_type,
    night_shift_type,
    rest_shift_group,
    work_shift_group,
    day_shift_group,
    night_shift_group,
    unwanted_skills_contract,
    general_contract_dict,
    min_cons_contract,
    full_time_valid_contract_with_general,
    contract_group_without_contradiction,
    nurse1,
    nurse_group1,
)
from constants import (
    user_token,
    profile_name,
    profile_nurse_groups,
    profile_nurses,
    profile_contract_groups,
    profile_contracts,
    profile_shift_groups,
    profile_shift_types,
    profile_shifts,
    profile_skills,
    work,
    shift_group_name,
    profile,
    shift_group_shifts_list,
    shift_group_shift_types,
)
from src.models.user import User
from src.exceptions.user_exceptions import ProfileAccessException
from pyfakefs.fake_filesystem_unittest import TestCase
from src.utils.file_system_manager import base_directory, dataset_directory


class TestProfileHandler(TestCase):
    def setUp(self) -> None:
        self.handler = ProfileHandler(connect_to_fake_db())
        user_dict = default_user.copy()
        user_dict[user_token] = random_hex
        user = User().from_json(user_dict)
        self.handler.user_dao.insert_one(user.db_json())
        self.handler.user_dao.insert_one(user1)
        self.setUpPyfakefs()
        self.fs.create_dir(base_directory)

    def tearDown(self) -> None:
        self.tearDownPyfakefs()

    def test_create_profile(self):
        self.handler.create_profile(random_hex, profile1)
        all_profiles = self.handler.profile_dao.fetch_all()
        profile_dir_exist = self.fs.exists(
            f"{base_directory}/{dataset_directory}/{profile1}"
        )
        self.assertEqual(1, len(all_profiles))
        expected = test_profile.copy()
        expected.pop(profile_access)
        self.assertEqual(expected, all_profiles[0])
        self.assertTrue(profile_dir_exist)

    def test_create_profile_with_whitespace_raise_error(self):
        with self.assertRaises(ProjectBaseException):
            self.handler.create_profile(random_hex, "hospital 1")

    def test_get_all_profiles_change_with_access(self):
        self.handler.create_profile(random_hex, profile1)
        admin_profiles = self.handler.get_all_profiles(random_hex)
        user1_profiles_before = self.handler.get_all_profiles(random_hex2)
        self.handler.share(random_hex, profile1, [user1_name])
        user1_profiles_after = self.handler.get_all_profiles(random_hex2)
        self.assertEqual(0, len(user1_profiles_before))
        self.assertEqual(1, len(admin_profiles))
        self.assertEqual(admin_profiles, user1_profiles_after)

    def test_revoke_access(self):
        self.handler.create_profile(random_hex, profile1)
        self.handler.share(random_hex, profile1, [user1_name])
        self.handler.revoke_access(random_hex, profile1, user1_name)
        user1_profiles_after = self.handler.get_all_profiles(random_hex2)
        self.assertEqual(0, len(user1_profiles_after))

    def test_duplicate_when_not_have_access_raise_error(self):
        self.handler.create_profile(random_hex, profile1)
        with self.assertRaises(ProfileAccessException):
            self.handler.duplicate(random_hex2, profile1, "profile2")

    def test_duplicate_profile_when_have_access_creates_duplicate(self):
        self.handler.create_profile(random_hex, profile1)
        self.handler.share(random_hex, profile1, [user1_name])
        self.handler.duplicate(random_hex2, profile1, "profile2")
        shift_groups_after_duplication = (
            self.handler.shift_group_dao.fetch_all(profile1)
        )
        shift_groups_duplicated = self.handler.shift_group_dao.fetch_all(
            "profile2"
        )
        all_profiles = self.handler.profile_dao.fetch_all()
        new_profile = self.handler.profile_dao.find_by_name("profile2")
        other_profile_exist = self.fs.exists(
            f"{base_directory}/{dataset_directory}/profile2"
        )
        self.assertEqual(2, len(all_profiles))
        self.assertEqual(2, len(shift_groups_after_duplication))
        self.assertEqual(2, len(shift_groups_duplicated))
        self.assertNotEqual(None, new_profile)
        self.assertTrue(other_profile_exist)

    def test_delete_profile_when_not_creator_raise_error(self):
        self.handler.create_profile(random_hex, profile1)
        self.handler.share(random_hex, profile1, [user1_name])
        with self.assertRaises(ProfileAccessException):
            self.handler.delete_profile(random_hex2, profile1)
        all_profiles = self.handler.profile_dao.fetch_all()
        profile_dir_exist = self.fs.exists(
            f"{base_directory}/{dataset_directory}/{profile1}"
        )
        self.assertEqual(1, len(all_profiles))
        self.assertTrue(profile_dir_exist)

    def test_delete_profile_when_creator_succeed(self):
        self.handler.create_profile(random_hex, profile1)
        self.handler.share(random_hex, profile1, [user1_name])
        self.handler.delete_profile(random_hex, profile1)
        all_profiles = self.handler.profile_dao.fetch_all()
        profile_dir_exist = self.fs.exists(
            f"{base_directory}/{dataset_directory}/{profile1}"
        )
        self.assertFalse(profile_dir_exist)
        self.assertEqual(0, len(all_profiles))

    def test_get_accessors_list(self):
        self.handler.create_profile(random_hex, profile1)
        actual = self.handler.get_accessors_list(random_hex, profile1)
        expected = [admin]
        self.assertEqual(expected, actual)

    def test_save_import(self):
        detailed_profile = {
            profile_name: profile1,
            profile_skills: [nurse_skill, head_nurse_skill, sociologist_skill],
            profile_shifts: [early_shift, late_shift],
            profile_shift_types: [day_shift_type, night_shift_type],
            profile_shift_groups: [
                work_shift_group,
                rest_shift_group,
                day_shift_group,
                night_shift_group,
            ],
            profile_contracts: [
                unwanted_skills_contract,
                min_cons_contract,
                general_contract_dict,
                full_time_valid_contract_with_general,
            ],
            profile_contract_groups: [contract_group_without_contradiction],
            profile_nurses: [nurse1],
            profile_nurse_groups: [nurse_group1],
        }
        self.handler.save_import(random_hex, detailed_profile)
        profile_exist = self.handler.profile_dao.exist(profile1)
        actual_shifts = self.handler.shift_dao.fetch_all(profile1)
        actual_skills = self.handler.skill_dao.get_all(profile1)
        actual_shift_types = self.handler.shift_type_dao.fetch_all(profile1)
        actual_shift_groups = self.handler.shift_group_dao.fetch_all(profile1)
        actual_contracts = self.handler.contract_dao.fetch_all(profile1)
        actual_contract_groups = self.handler.contract_group_dao.fetch_all(
            profile1
        )
        actual_nurses = self.handler.nurse_dao.fetch_all(profile1)
        actual_nurse_groups = self.handler.nurse_group_dao.fetch_all(profile1)
        actual_work_shift_group = self.handler.shift_group_dao.find_by_name(
            work, profile1
        )
        expected_work_shift_group = {
            shift_group_name: work,
            shift_group_shifts_list: ["Early", "Late"],
            profile: profile1,
            shift_group_shift_types: ["Day", "Night"],
        }
        self.assertTrue(profile_exist)
        self.assertEqual(2, len(actual_shifts))
        self.assertEqual(3, len(actual_skills))
        self.assertEqual(2, len(actual_shift_types))
        self.assertEqual(4, len(actual_shift_groups))
        self.assertEqual(4, len(actual_contracts))
        self.assertEqual(1, len(actual_contract_groups))
        self.assertEqual(1, len(actual_nurses))
        self.assertEqual(1, len(actual_nurse_groups))
        self.assertEqual(expected_work_shift_group, actual_work_shift_group)

    def test_export_profile(self):
        detailed_profile = {
            profile_name: profile1,
            profile_skills: [nurse_skill, head_nurse_skill, sociologist_skill],
            profile_shifts: [early_shift, late_shift],
            profile_shift_types: [day_shift_type, night_shift_type],
            profile_shift_groups: [
                work_shift_group,
                rest_shift_group,
                day_shift_group,
                night_shift_group,
            ],
            profile_contracts: [
                unwanted_skills_contract,
                min_cons_contract,
                general_contract_dict,
                full_time_valid_contract_with_general,
            ],
            profile_contract_groups: [contract_group_without_contradiction],
            profile_nurses: [nurse1],
            profile_nurse_groups: [nurse_group1],
        }
        text = """profile,
name,profile1
skills,
Nurse
HeadNurse
Sociologist
shifts,
Early,08:00:00,16:00:00
Late,18:00:00,24:00:00
shift types,
Day,Early
Night,Late
shift groups,
Work,Early,Late,Day,Night
Rest
Day,Early
Night
contracts,
name,unwantedSkillsContract
unwanted skills,Nurse,hard

name,minConsContract
minimum and maximum of consecutive working weekends,Early,1.0,5.0,5.0,hard

name,General
unwanted shift,Early,hard

name,FullTime Valid
unwanted shift,Late,1.0

contract groups,
contract_group_without_contradiction,minConsContract
nurses,
nurse1,nurse1,FullTime Valid,minConsContract
nurse groups,
group1,General,nurse1
"""
        self.handler.save_import(random_hex, detailed_profile)
        profile_str = self.handler.export_profile(random_hex, profile1)
        self.assertEqual(text, profile_str)
