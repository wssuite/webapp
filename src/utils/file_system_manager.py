import os
from src.exceptions.file_system_exceptions import (
    NoSolutionFoundException,
    NoVersionFoundException,
)
import shutil

dataset_directory = "dataset"
base_directory = os.getcwd()
solution_prefix = "sol"


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
                raise NoSolutionFoundException()
        except OSError:
            raise NoVersionFoundException()

    @staticmethod
    def create_dir_if_not_exist(name):
        exists = FileSystemManager.exist(name)
        if exists is False:
            os.mkdir(name)

    @staticmethod
    def current_version(dir_name: str):
        return len(os.listdir(dir_name))

    @staticmethod
    def delete_dir(name):
        shutil.rmtree(name)

    @staticmethod
    def get_dataset_directory_path():
        return os.path.join(base_directory, dataset_directory)

    @staticmethod
    def exist(name):
        return os.path.exists(name)

    @staticmethod
    def get_path_to_generate_schedule(profile, start_date, end_date):
        r_path = os.path.join(profile, f"{start_date}_{end_date}")
        full_path = os.path.join(
            FileSystemManager.get_dataset_directory_path(), r_path
        )
        FileSystemManager.create_dir_if_not_exist(full_path)
        curr_version = FileSystemManager.current_version(full_path)
        next_version = curr_version + 1
        full_path = os.path.join(full_path, str(next_version))
        FileSystemManager.create_dir_if_not_exist(full_path)
        return full_path, next_version

    @staticmethod
    def get_input_problem_path(profile_name, start_date, end_date, version):
        return os.path.join(
            FileSystemManager.get_dataset_directory_path(),
            profile_name,
            f"{start_date}_{end_date}",
            version,
            "input.txt",
        )
