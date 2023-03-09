from src.dao.abstract_dao import connect_to_fake_db
from src.handlers.skill_handler import SkillHandler
from test_constants import (
    random_hex,
    default_user,
    nurse_skill,
    head_nurse_skill,
    sociologist_skill, profile1
)
from unittest import TestCase
from constants import user_token


class TestSkillHandler(TestCase):
    def setUp(self) -> None:
        self.handler = SkillHandler(connect_to_fake_db())
        user = default_user.copy()
        user[user_token] = random_hex
        skill_array = [nurse_skill, head_nurse_skill, sociologist_skill]
        self.handler.user_dao.insert_one(user.copy())
        self.handler.skill_dao.insert_many(skill_array)

    def tearDown(self) -> None:
        pass

    def test_get_all_skills(self):
        expected = [nurse_skill, head_nurse_skill, sociologist_skill]
        actual = self.handler.get_all(random_hex, profile1)
        self.assertEqual(expected, actual)
