from src.models.skill import Skill
from unittest import TestCase
from test_constants import nurse_skill


class TestSkill(TestCase):
    def setUp(self) -> None:
        self.skill_dict = nurse_skill.copy()

    def tearDown(self) -> None:
        pass

    def test_skill_creation_from_json(self):
        skill = Skill().from_json(self.skill_dict)
        self.assertEqual(self.skill_dict, skill.db_json())
