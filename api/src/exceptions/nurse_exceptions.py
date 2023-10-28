from src.exceptions.project_base_exception import ProjectBaseException
from error_msg import (
    nurse_username_already_exist,
    nurse_group_already_exist,
    nurse_not_found,
    deletion_error,
    nurse_group_not_found,
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
    def __init__(self, name, usage):
        msg = f"the nurse {name}"
        usage_str = self.get_usage_str("nurse groups", usage)
        super(CannotDeleteNurse, self).__init__(
            deletion_error.format(msg, usage_str)
        )


class NurseGroupNotFound(ProjectBaseException):
    def __init__(self, name):
        msg = nurse_group_not_found.format(name)
        super(NurseGroupNotFound, self).__init__(msg)
