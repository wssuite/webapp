from pymongo.collection import Collection

from src.dao.abstract_dao import AbstractDao
from src.models.skill import Skill, skill_name
from constants import mongo_id_field


class SkillDao(AbstractDao):
    def __init__(self, mongo):
        super().__init__(mongo)
        self.collection: Collection = self.db.skills

    def insert_many(self, skills):
        for skill in skills:
            if self.exist(skill) is False:
                skill_object = Skill()
                skill_object.name = skill
                self.collection.insert_one(skill_object.db_json())

    def exist(self, name):
        return self.collection.find_one({skill_name: name}) is not None

    def get_all(self):
        skills = []
        cursor = self.collection.find({}, {mongo_id_field: 0})
        for element in cursor:
            skill = Skill().from_json(element)
            skills.append(skill.to_json())

        return skills
