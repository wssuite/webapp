from pyfakefs.fake_filesystem_unittest import TestCase, patchfs
from src.cpp_utils.schedule import Schedule
from uuid import uuid4

text = """
HEADERS
(0,Patrick)
END
instance1,2010-06-01,2010-06-28
Assignments = 2
2010-06-01,0,Late,Nurse
2010-06-05,0,Early,Nurse
"""


def create_schedule(fake_fs):
    uuid = uuid4()
    fake_fs.create_file(uuid.hex, contents=text)
    return Schedule(uuid.hex)


class TestSchedule(TestCase):
    def setUp(self):
        self.setUpPyfakefs()

    def tearDown(self) -> None:
        self.tearDownPyfakefs()

    @patchfs
    def test_filter_schedule_by_name(self, fake_fs):
        filtering_by_name = {
            "startDate": "2010-06-01",
            "endDate": "2010-06-28",
            "schedule": [{
                "employee_name": "Patrick",
                "assignments": [
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
            }]
        }

        schedule = create_schedule(fake_fs)
        self.assertEqual(filtering_by_name, schedule.filter_by_name())

    @patchfs
    def test_schedule_init(self, fake_fs):
        schedule = create_schedule(fake_fs)
        self.assertEqual(len(schedule.assignments_list), 2)
