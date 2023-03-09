from pymongo.collection import Collection

from src.dao.abstract_dao import AbstractDao
from src.models.skill import Skill, skill_name
from constants import mongo_id_field, profile


class SkillDao(AbstractDao):
    def __init__(self, mongo):
        super().__init__(mongo)
        self.collection: Collection = self.db.skills

    def insert_many(self, skills):
        for skill in skills:
            skill_object = Skill().from_json(skill)
            if self.exist(skill_object.name, skill_object.profile) is False:
                self.collection.insert_one(skill_object.db_json())

    def exist(self, name, profile_name):
        return (
            self.collection.find_one(
                {skill_name: name}, {profile: profile_name}
            )
            is not None
        )

    def get_all(self, profile_name):
        skills = []
        cursor = self.collection.find(
            {profile: profile_name}, {mongo_id_field: 0}
        )
        for element in cursor:
            skill = Skill().from_json(element)
            skills.append(skill.to_json())

        return skills
