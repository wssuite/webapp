from src.exceptions.project_base_exception import ProjectBaseException
from error_msg import skill_already_exist, deletion_error


class SkillAlreadyExists(ProjectBaseException):
    def __init__(self, skill):
        msg = skill_already_exist.format(skill)
        super(SkillAlreadyExists, self).__init__(msg)


class CannotDeleteSkill(ProjectBaseException):
    def __init__(self, name):
        skill = f"the skill {name}"
        msg = deletion_error.format(skill)
        super(CannotDeleteSkill, self).__init__(msg)
