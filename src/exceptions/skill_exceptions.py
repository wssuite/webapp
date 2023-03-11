from src.exceptions.project_base_exception import ProjectBaseException
from error_msg import skill_already_exist


class SkillAlreadyExists(ProjectBaseException):
    def __init__(self, skill):
        msg = skill_already_exist.format(skill)
        super(SkillAlreadyExists, self).__init__(msg)
