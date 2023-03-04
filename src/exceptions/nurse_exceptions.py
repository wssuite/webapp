from src.exceptions.project_base_exception import ProjectBaseException
from error_msg import (
    nurse_username_already_exist,
    nurse_group_already_exist,
    nurse_not_found,
    deletion_error,
)


class NurseUsernameAlreadyExist(ProjectBaseException):
    def __init__(self, username):
        msg = nurse_username_already_exist.format(username)
        super(NurseUsernameAlreadyExist, self).__init__(msg)


class NurseGroupAlreadyExist(ProjectBaseException):
    def __init__(self, name):
        msg = nurse_group_already_exist.format(name)
        super(NurseGroupAlreadyExist, self).__init__(msg)


class NurseNotFound(ProjectBaseException):
    def __init__(self, name):
        msg = nurse_not_found.format(name)
        super(NurseNotFound, self).__init__(msg)


class CannotDeleteNurse(ProjectBaseException):
    def __init__(self, name):
        msg = f"the nurse {name}"
        super(CannotDeleteNurse, self).__init__(deletion_error.format(msg))
