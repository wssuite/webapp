from src.dao.abstract_dao import connect_to_fake_db
from src.dao.skill_dao import SkillDao
from unittest import TestCase
from test_constants import (
    nurse_skill,
    head_nurse_skill,
    sociologist_skill, profile1
)


class TestShiftDao(TestCase):
    def setUp(self) -> None:
        self.dao = SkillDao(connect_to_fake_db())
        self.skills = [nurse_skill, head_nurse_skill, sociologist_skill]

    def test_insert_many_without_duplicates(self):
        expected = [nurse_skill, head_nurse_skill, sociologist_skill]
        self.dao.insert_many(self.skills)
        result = self.dao.get_all(profile1)
        empty_skills = self.dao.get_all("profile2")
        self.assertEqual(expected, result)
        self.assertEqual([], empty_skills)
