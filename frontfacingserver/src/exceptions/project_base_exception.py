class ProjectBaseException(Exception):
    def __init__(self, msg):
        super(ProjectBaseException, self).__init__(msg)

    @staticmethod
    def get_usage_str(usage):
        usage_str = ""
        for element in usage:
            usage_str += f"{element}\n"
        return usage_str
