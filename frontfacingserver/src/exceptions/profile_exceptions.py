from src.exceptions.project_base_exception import ProjectBaseException
from error_msg import profile_already_exist


class ProfileAlreadyExist(ProjectBaseException):
    def __init__(self, name):
        msg = profile_already_exist.format(name)
        super(ProfileAlreadyExist, self).__init__(msg)
