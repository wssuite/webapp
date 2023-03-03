from src.models.skill import Skill
from unittest import TestCase
from constants import skill_name


class TestSkill(TestCase):
    def setUp(self) -> None:
        self.skill_dict = {skill_name: "Nurse"}

    def tearDown(self) -> None:
        pass

    def test_skill_creation_from_json(self):
        skill = Skill().from_json(self.skill_dict)
        self.assertEqual(self.skill_dict, skill.db_json())
