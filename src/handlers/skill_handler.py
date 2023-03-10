from src.handlers.base_handler import BaseHandler


class SkillHandler(BaseHandler):
    def __init__(self, mongo):
        super().__init__(mongo)

    def get_all(self, token, profile):
        super().get_all(token, profile)
        return self.skill_dao.get_all(profile)
