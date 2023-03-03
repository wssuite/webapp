from src.handlers.user_handler import verify_token
from src.dao.user_dao import UserDao
from src.dao.skill_dao import SkillDao


class SkillHandler:
    def __init__(self, mongo):
        self.user_dao = UserDao(mongo)
        self.skill_dao = SkillDao(mongo)

    def get_all(self, token):
        verify_token(token, self.user_dao)
        return self.skill_dao.get_all()
