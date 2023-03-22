from pymongo.collection import Collection
from src.exceptions.skill_exceptions import SkillAlreadyExists
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
            self.collection.find_one({skill_name: name, profile: profile_name})
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

    def insert_one_if_not_exist(self, json):
        exist = self.exist(json[skill_name], json[profile])
        if exist is True:
            raise SkillAlreadyExists(json[skill_name])
        self.collection.insert_one(json)

    def remove(self, name, profile_name):
        self.collection.find_one_and_delete(
            {skill_name: name, profile: profile_name}
        )

    def delete_all(self, profile_name):
        self.collection.delete_many({profile: profile_name})

    def duplicate(self, profile1, profile2):
        skills = self.get_all(profile1)
        for skill in skills:
            skill_object = Skill().from_json(skill)
            skill_object.profile = profile2
            self.collection.insert_one(skill_object.db_json())
