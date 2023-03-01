from src.dao.abstract_dao import connect_to_fake_db
from src.dao.skill_dao import SkillDao
from unittest import TestCase
from constants import skill_name


class TestShiftDao(TestCase):
    def setUp(self) -> None:
        self.dao = SkillDao(connect_to_fake_db())
        self.skills = ["Nurse", "HeadNurse", "Sociologist", "Nurse"]

    def test_insert_many_without_duplicates(self):
        expected = [
            {skill_name: "Nurse"},
            {skill_name: "HeadNurse"},
            {skill_name: "Sociologist"},
        ]
        self.dao.insert_many(self.skills)
        result = self.dao.get_all()
        self.assertEqual(expected, result)
