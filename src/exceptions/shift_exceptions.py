from src.exceptions.project_base_exception import ProjectBaseException
from error_msg import (
    shift_already_exists,
    shift_type_already_exists,
    shift_group_already_exists,
    shifts_not_exist,
)


class ShiftAlreadyExistException(ProjectBaseException):
    def __init__(self, shift_name):
        msg = shift_already_exists.format(shift_name)
        super(ShiftAlreadyExistException, self).__init__(msg)


class ShiftTypeAlreadyExistException(ProjectBaseException):
    def __init__(self, shift_type_name):
        msg = shift_type_already_exists.format(shift_type_name)
        super(ShiftTypeAlreadyExistException, self).__init__(msg)


class ShiftGroupAlreadyExistException(ProjectBaseException):
    def __init__(self, shift_group_name):
        msg = shift_group_already_exists.format(shift_group_name)
        super(ShiftGroupAlreadyExistException, self).__init__(msg)


class ShiftNotExist(ProjectBaseException):
    def __init__(self, shifts):
        msg = shifts_not_exist.format(shifts)
        super(ShiftNotExist, self).__init__(msg)
