from src.exceptions.project_base_exception import ProjectBaseException
from error_msg import shift_already_exists


class ShiftAlreadyExistException(ProjectBaseException):
    def __init__(self, shift_name):
        msg = shift_already_exists.format(shift_name)
        super().__init__(msg)


class ShiftTypeAlreadyExistException(
    ProjectBaseException
):
    def __init__(self, shift_type_name):
        msg = shift_already_exists.format(shift_type_name)
        super().__init__(msg)
