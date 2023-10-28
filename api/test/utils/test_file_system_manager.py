from pyfakefs.fake_filesystem import FakeFilesystem

from src.utils.file_system_manager import (
    FileSystemManager,
    dataset_directory,
    base_directory,
)
from pyfakefs.fake_filesystem_unittest import TestCase, patchfs
from unittest.mock import patch


class TestFileSystemManager(TestCase):
    def setUp(self):
        self.setUpPyfakefs()

    def tearDown(self):
        self.tearDownPyfakefs()

    @patchfs
    @patch("os.mkdir")
    def test_dir_created_if_not_exist(self, fake_fs, mock_mkdir):
        fake_fs.create_dir(base_directory)
        FileSystemManager()
        mock_mkdir.assert_called_once_with(dataset_directory)

    @patchfs
    @patch("os.mkdir")
    def test_dir_is_not_created_if_exist(self, fake_fs, mock_mkdir):
        fake_fs.create_dir(f"{base_directory}/{dataset_directory}")
        FileSystemManager()
        mock_mkdir.assert_not_called()

    @patchfs
    def test_get_current_version(self, fake_fs: FakeFilesystem):
        dir_name = f"{base_directory}/{dataset_directory}/prototype"
        fake_fs.create_dir(dir_name)
        self.assertEqual(FileSystemManager.current_version(dir_name), 0)

    def test_get_current_version_when_folder_is_deleted(self):
        dir_name = f"{base_directory}/{dataset_directory}/prototype"
        first_version = f"{dir_name}/1"
        second_version = f"{dir_name}/2"
        self.fs.create_dir(first_version)
        self.fs.create_dir(second_version)
        before = FileSystemManager.current_version(dir_name)
        FileSystemManager.delete_dir(first_version)
        after = FileSystemManager.current_version(dir_name)
        self.assertEqual(before, after)

    def test_get_path_to_generate_schedule(self):
        self.fs.create_dir(f"{base_directory}/{dataset_directory}/prototype")
        full_path1, next_version1 = FileSystemManager.get_path_to_generate_schedule(
            "prototype", "2023-06-01", "2023-06-02", None
        )
        self.assertEqual("1.0", next_version1)
        full_path1_1, next_version1_1 = FileSystemManager.get_path_to_generate_schedule(
            "prototype", "2023-06-01", "2023-06-02", "1.0"
        )
        self.assertEqual("1.1", next_version1_1)
        full_path2, next_version2 = FileSystemManager.get_path_to_generate_schedule(
            "prototype", "2023-06-01", "2023-06-02", None
        )
        self.assertEqual("2.0", next_version2)
        full_path1_2, next_version1_2 = FileSystemManager.get_path_to_generate_schedule(
            "prototype", "2023-06-01", "2023-06-02", "1.1"
        )
        self.assertEqual("1.2", next_version1_2)
        full_path2_1, next_version2_1 = FileSystemManager.get_path_to_generate_schedule(
            "prototype", "2023-06-01", "2023-06-02", "2.0"
        )
        self.assertEqual("2.1", next_version2_1)
