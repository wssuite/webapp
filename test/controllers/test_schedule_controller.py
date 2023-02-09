from pyfakefs.fake_filesystem_unittest import TestCase, patchfs

import app
from file_system_manager import dataset_directory, base_directory

instance = "prototype"
version = "1"
solution_file = "sol.txt"
solution_content = """Assignments = 1
{2010-06-01,Patrick,Late,Nurse}
{2010-06-05,Patrick,Early,Nurse}"""


def create_sol_file(fake_fs):
    fake_fs.create_dir(base_directory)
    fake_fs.create_dir(f"{base_directory}/{dataset_directory}/{instance}/{version}")
    fake_fs.create_file(f"{base_directory}/{dataset_directory}/{instance}/{version}/"
                        f"{solution_file}",
                        contents=solution_content)


class TestScheduleController(TestCase):
    def setUp(self) -> None:
        self.setUpPyfakefs()
        self.client = app.test_client()

    def tearDown(self) -> None:
        self.tearDownPyfakefs()

    @patchfs()
    def test_get_schedule_filtered_by_name(self, fake_fs):
        create_sol_file(fake_fs)
        dict_response = {
            "Patrick": [
                {
                    "date": "2010-06-01",
                    "employee_name": "Patrick",
                    "shift": "Late",
                    "skill": "Nurse"
                },
                {
                    "date": "2010-06-05",
                    "employee_name": "Patrick",
                    "shift": "Early",
                    "skill": "Nurse"
                }
            ]
        }
        path = f"/schedule/nameFilter/{instance}?version=1"
        response = self.client.get(path)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, dict_response)
