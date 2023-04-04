from src.exceptions.project_base_exception import ProjectBaseException
import error_msg


class NoSolutionFoundException(ProjectBaseException):
    def __init__(self):
        super(NoSolutionFoundException, self).__init__(
            error_msg.no_solution_found
        )


class NoVersionFoundException(ProjectBaseException):
    def __init__(self):
        super(NoVersionFoundException, self).__init__(
            error_msg.version_not_found
        )
