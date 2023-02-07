from pyfakefs.fake_filesystem import FakeFilesystem

from file_system_manger import FileSystemManager, dataset_directory
from pyfakefs.fake_filesystem_unittest import TestCase, patchfs
from unittest.mock import patch


class TestFileSystemManager(TestCase):
    def setUp(self):
        self.setUpPyfakefs()

    def tearDown(self):
        self.tearDownPyfakefs()

    @patch("os.mkdir")
    def test_dir_created_if_not_exist(self, mock_mkdir):
        FileSystemManager()
        mock_mkdir.assert_called_once_with(dataset_directory)

    @patchfs
    @patch("os.mkdir")
    def test_dir_is_not_created_if_exist(self, fake_fs, mock_mkdir):
        fake_fs.create_dir(dataset_directory)
        FileSystemManager()
        mock_mkdir.assert_not_called()

    @patchfs
    def test_get_current_version(self, fake_fs: FakeFilesystem):
        dir_name = f"{dataset_directory}/prototype"
        fake_fs.create_dir(dir_name)
        self.assertEqual(FileSystemManager.current_version(dir_name), 0)

    @patchfs
    def test_get_solution_if_directory_not_exist_throws_error(
            self, fake_fs: FakeFilesystem):
        dir_name = f"{dataset_directory}/prototype"
        fake_fs.create_dir(dir_name)
        fsm = FileSystemManager()
        with self.assertRaises(OSError, msg="Version not found"):
            fsm.get_solution_path("prototype", 1)

    @patchfs
    def test_get_solution_if_solution_file_not_exist_throws_exception(
            self, fake_fs: FakeFilesystem):
        dir_name = f"{dataset_directory}/prototype/1"
        fake_fs.create_dir(dir_name)
        fsm = FileSystemManager()
        with self.assertRaises(Exception, msg="No Solution found"):
            fsm.get_solution_path("prototype", 1)

    @patchfs
    def test_get_solution_if_solution_exist_return_path(
            self, fake_fs: FakeFilesystem):
        file_path = f"/{dataset_directory}/prototype/1/Sol"
        dir_name = f"/{dataset_directory}/prototype/1/"
        fake_fs.create_dir(dir_name)
        assert fake_fs.exists(dir_name)
        fake_fs.create_file(file_path)
        fsm = FileSystemManager()
        self.assertEqual(fsm.get_solution_path("prototype", 1), file_path)
