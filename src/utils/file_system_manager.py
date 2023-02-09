import os
import error_msg

dataset_directory = "dataset"
base_directory = os.getcwd()
solution_prefix = 'sol'


class FileSystemManager:
    def __init__(self):
        os.chdir(base_directory)
        self.create_dir_if_not_exist(dataset_directory)

    """Here we make the assumption that there is only one solution file"""

    @staticmethod
    def get_solution_path(instance_name, version) -> str:
        os.chdir(base_directory)
        target_dir = f"{dataset_directory}/{instance_name}/{version}"
        try:
            os.chdir(target_dir)
            target_file = os.getcwd()
            target_file_found = False
            cur_dir = os.getcwd()
            for file in os.listdir(cur_dir):
                if file.lower().startswith(solution_prefix):
                    target_file += f"/{file}"
                    target_file_found = True
                    break
            if target_file_found is True:
                return target_file
            else:
                raise Exception(error_msg.no_solution_found)
        except OSError:
            raise OSError(error_msg.version_not_found)

    @staticmethod
    def create_dir_if_not_exist(name):
        exists = os.path.exists(name)
        if exists is False:
            os.mkdir(name)

    @staticmethod
    def current_version(dir_name: str):
        return len(os.listdir(dir_name))
