from src.dao.skill_dao import skill_name
from src.handlers.base_handler import BaseHandler


class SkillHandler(BaseHandler):
    def __init__(self, mongo):
        super().__init__(mongo)

    def add(self, token, json):
        super().add(token, json)
        return self.skill_dao.insert_one_if_not_exist(json)

    def delete(self, token, name, profile_name):
        super().delete(token, name, profile_name)
        return self.skill_dao.remove(name)

    def get_all_names(self, token, profile_name):
        return [skill[skill_name]
                for skill in self.get_all(token, profile_name)]

    def get_all(self, token, profile):
        super().get_all(token, profile)
        return self.skill_dao.get_all(profile)
