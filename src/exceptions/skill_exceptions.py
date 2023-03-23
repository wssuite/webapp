from src.exceptions.project_base_exception import ProjectBaseException
from error_msg import skill_already_exist, deletion_error, skill_not_exist


class SkillAlreadyExists(ProjectBaseException):
    def __init__(self, skill):
        msg = skill_already_exist.format(skill)
        super(SkillAlreadyExists, self).__init__(msg)


class CannotDeleteSkill(ProjectBaseException):
    def __init__(self, name, usage):
        skill = f"the skill {name}"
        usage_str = self.get_usage_str(usage)
        msg = deletion_error.format(skill, usage_str)
        super(CannotDeleteSkill, self).__init__(msg)


class SkillNotExist(ProjectBaseException):
    def __init__(self, skills):
        msg = skill_not_exist.format(skills)
        super(SkillNotExist, self).__init__(msg)
