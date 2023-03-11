from src.dao.abstract_dao import connect_to_fake_db
from src.handlers.skill_handler import SkillHandler
from test_constants import (
    random_hex,
    default_user,
    nurse_skill,
    head_nurse_skill,
    sociologist_skill,
    profile1,
    test_profile,
    unwanted_skills_contract,
)
from unittest import TestCase
from constants import user_token, skill_name
from src.exceptions.skill_exceptions import CannotDeleteSkill
from src.models.contract import Contract


class TestSkillHandler(TestCase):
    def setUp(self) -> None:
        self.handler = SkillHandler(connect_to_fake_db())
        user = default_user.copy()
        user[user_token] = random_hex
        self.skill_array = [head_nurse_skill, sociologist_skill]
        self.handler.user_dao.insert_one(user.copy())
        self.handler.profile_dao.insert_if_not_exist(test_profile.copy())
        contract = Contract().from_json(unwanted_skills_contract)
        self.handler.contract_dao.insert_one(contract.db_json())

    def tearDown(self) -> None:
        pass

    def test_add_new_skill(self):
        copy_skill = nurse_skill.copy()
        self.handler.add(random_hex, copy_skill)
        profile_skills = self.handler.get_all_names(random_hex, profile1)
        self.assertEqual(1, len(profile_skills))
        self.assertEqual(nurse_skill[skill_name], profile_skills[0])

    def test_get_all_skills(self):
        expected = [head_nurse_skill, sociologist_skill]
        self.handler.skill_dao.insert_many(self.skill_array)
        actual = self.handler.get_all(random_hex, profile1)
        self.assertEqual(expected, actual)

    def test_delete_skill_if_used_by_contract_raise_error(self):
        self.handler.skill_dao.insert_many(self.skill_array)
        copy_skill = nurse_skill.copy()
        self.handler.add(random_hex, copy_skill)
        with self.assertRaises(CannotDeleteSkill):
            self.handler.delete(random_hex, nurse_skill[skill_name], profile1)

    def test_skill_if_not_used_succeed(self):
        self.handler.skill_dao.insert_many(self.skill_array)
        copy_skill = nurse_skill.copy()
        self.handler.add(random_hex, copy_skill)
        before = self.handler.get_all(random_hex, profile1)
        self.handler.delete(random_hex, head_nurse_skill[skill_name], profile1)
        after = self.handler.get_all(random_hex, profile1)
        self.assertEqual(3, len(before))
        self.assertEqual(2, len(after))
