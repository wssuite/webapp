from src.exceptions.project_base_exception import ProjectBaseException
from error_msg import (
    user_already_exist,
    user_not_exist,
    password_not_valid,
    user_error,
    admin_only,
    delete_admin_error,
    login_required_error,
)


class UserAlreadyExist(ProjectBaseException):
    def __init__(self, username):
        msg = user_already_exist.format(username)
        super().__init__(msg)


class WrongPassword(ProjectBaseException):
    def __init__(self):
        super().__init__(password_not_valid)


class UserNotExist(ProjectBaseException):
    def __init__(self, username):
        super().__init__(user_not_exist.format(username))


class TokenInvalid(ProjectBaseException):
    def __init__(self):
        super().__init__(user_error)


class AdminOnlyAction(ProjectBaseException):
    def __init__(self):
        super().__init__(admin_only)


class CannotDeleteAdmin(ProjectBaseException):
    def __init__(self):
        super().__init__(delete_admin_error)


class LoginRequired(ProjectBaseException):
    def __init__(self):
        super().__init__(login_required_error)
