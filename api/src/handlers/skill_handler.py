from constants import contract_name
from src.dao.skill_dao import skill_name
from src.handlers.base_handler import BaseHandler
from src.exceptions.skill_exceptions import CannotDeleteSkill
from src.models.skill import Skill


class SkillHandler(BaseHandler):
    def __init__(self, mongo):
        super().__init__(mongo)

    def add(self, token, json):
        super().add(token, json)
        skill = Skill().from_json(json)
        self.verify_name_is_valid(skill.name)
        self.skill_dao.insert_one_if_not_exist(skill.db_json())

    def delete(self, token, name, profile_name):
        super().delete(token, name, profile_name)
        usage = [
            contract[contract_name]
            for contract in self.contract_dao.get_including_skills(
                [name], profile_name
            )
        ]
        if len(usage) > 0:
            raise CannotDeleteSkill(name, usage)
        self.skill_dao.remove(name, profile_name)

    def get_all_names(self, token, profile_name):
        return [
            skill[skill_name] for skill in self.get_all(token, profile_name)
        ]

    def get_all(self, token, profile):
        super().get_all(token, profile)
        return self.skill_dao.get_all(profile)
