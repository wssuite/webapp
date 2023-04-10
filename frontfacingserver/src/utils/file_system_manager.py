import os
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
    def get_solution_dir_path(
        instance_name, start_date, end_date, version
    ) -> str:
        target_dir = os.path.join(
            FileSystemManager.get_dataset_directory_path(),
            instance_name,
            f"{start_date}_{end_date}",
            version,
        )
        return target_dir

    @staticmethod
    def create_dir_if_not_exist(name):
        exists = FileSystemManager.exist(name)
        if exists is False:
            os.mkdir(name)

    @staticmethod
    def current_version(dir_name: str):
        max_version = 0
        for version in os.listdir(dir_name):
            version_ = int(float(version))
            if version_ > max_version:
                max_version = version_
        return max_version

    @staticmethod
    def current_revision(dir_name, v):
        max_revision = 0
        revisions = os.listdir(dir_name)
        targeted_revisions = []
        for revision in revisions:
            if int(float(revision)) == int(float(v)):
                minor_version = revision.split('.')[-1]
                targeted_revisions.append(minor_version)

        for revision in targeted_revisions:
            if int(revision) > max_revision:
                max_revision = int(revision)

        return max_revision

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
    def get_path_to_generate_schedule(profile, start_date, end_date, v):
        r_path = os.path.join(profile, f"{start_date}_{end_date}")
        full_path = os.path.join(
            FileSystemManager.get_dataset_directory_path(), r_path
        )
        FileSystemManager.create_dir_if_not_exist(full_path)
        curr_version = FileSystemManager.current_version(full_path)
        next_version = f"{curr_version}"
        if v is None:
            next_version = f"{curr_version + 1}.0"
        else:
            curr_minor_version = FileSystemManager.current_revision(
                full_path,
                v
            )
            next_version = f"{int(float(v))}.{curr_minor_version + 1}"

        full_path = os.path.join(full_path, next_version)
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
