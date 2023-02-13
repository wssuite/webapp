import error_msg
from pyfakefs.fake_filesystem_unittest import TestCase, patchfs

import app
from src.utils.file_system_manager import dataset_directory, base_directory
from constants import assignment_skill, assignment_date,\
    assignment_shift, assignment_employee_name, start_date,\
    end_date, schedule_string, assignments_string

instance = "prototype"
version = "1"
solution_file = "sol.txt"
solution_content = """
instance1,2010-06-01,2010-06-28
Assignments = 3
2010-06-01,Patrick,Late,Nurse
2010-06-05,Patrick,Early,Nurse
2010-06-03,Eve,Late,HeadNurse"""


def create_dir(fake_fs):
    fake_fs.create_dir(base_directory)
    fake_fs.create_dir(f"{base_directory}/{dataset_directory}/{instance}/"
                       f"{version}")


def create_sol_file(fake_fs):
    fake_fs.create_file(f"{base_directory}/{dataset_directory}/{instance}/"
                        f"{version}/{solution_file}",
                        contents=solution_content)


class TestScheduleController(TestCase):
    def setUp(self) -> None:
        self.setUpPyfakefs()
        self.client = app.test_client()

    def tearDown(self) -> None:
        self.tearDownPyfakefs()

    @patchfs()
    def test_get_schedule_filtered_by_name_if_no_errors_succeed(self, fake_fs):
        create_dir(fake_fs)
        create_sol_file(fake_fs)
        dict_response = {
            start_date: "2010-06-01",
            end_date: "2010-06-28",
            schedule_string: [
                {assignment_employee_name: "Patrick",
                 assignments_string: [
                     {
                         assignment_date: "2010-06-01",
                         assignment_employee_name: "Patrick",
                         assignment_shift: "Late",
                         assignment_skill: "Nurse"
                     },
                     {
                         assignment_date: "2010-06-05",
                         assignment_employee_name: "Patrick",
                         assignment_shift: "Early",
                         assignment_skill: "Nurse"
                     }]
                 },
                {assignment_employee_name: "Eve",
                 assignments_string: [
                     {
                         assignment_date: "2010-06-03",
                         assignment_employee_name: "Eve",
                         assignment_shift: "Late",
                         assignment_skill: "HeadNurse"
                     }
                 ]}
            ]}
        path = f"/schedule/nameFilter/{instance}?version=1"
        response = self.client.get(path)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, dict_response)

    @patchfs()
    def test_get_schedule_filtered_by_name_if_solution_not_exist_fail(
            self, fake_fs):
        create_dir(fake_fs)
        path = f"/schedule/nameFilter/{instance}?version=1"
        response = self.client.get(path)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data.decode(), error_msg.no_solution_found)

    @patchfs()
    def test_get_schedule_filtered_by_name_if_version_not_specified_fail(
            self, fake_fs):
        create_dir(fake_fs)
        path = f"/schedule/nameFilter/{instance}"
        response = self.client.get(path)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data.decode(), error_msg.version_required)
