from src.handlers.user_handler import verify_token
from src.dao.user_dao import UserDao
from src.dao.skill_dao import SkillDao, skill_name


class SkillHandler:
    def __init__(self, mongo):
        self.user_dao = UserDao(mongo)
        self.skill_dao = SkillDao(mongo)

    def get_all(self, token):
        verify_token(token, self.user_dao)
        return self.skill_dao.get_all()

    def add(self, token, json):
        verify_token(token, self.user_dao)
        return self.skill_dao.insert_one_if_not_exist(json)

    def delete(self, token, name):
        verify_token(token, self.user_dao)
        return self.skill_dao.remove(name)

    def get_all_names(self, token):
        return [skill[skill_name]
                for skill in self.get_all(token)]
