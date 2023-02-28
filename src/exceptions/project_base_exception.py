class ProjectBaseException(Exception):
    def __init__(self, msg):
        super(ProjectBaseException, self).__init__(msg)
