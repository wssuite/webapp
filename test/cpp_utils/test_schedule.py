from pyfakefs.fake_filesystem_unittest import TestCase, patchfs
from src.models.schedule import Schedule
from uuid import uuid4
from constants import (
    assignment_skill,
    assignment_date,
    assignment_shift,
    assignment_employee_name,
    start_date,
    end_date,
    schedule_string,
    assignments_string,
)

text = """
HEADERS
(0,Patrick)
END
instance1,1,2010-06-01,2010-06-28
ASSIGNMENTS
0,2010-06-01,Late,Nurse
0,2010-06-05,Early,Nurse
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
            start_date: "2010-06-01",
            end_date: "2010-06-28",
            schedule_string: [
                {
                    assignment_employee_name: "Patrick",
                    assignments_string: [
                        {
                            assignment_date: "2010-06-01",
                            assignment_employee_name: "Patrick",
                            assignment_shift: "Late",
                            assignment_skill: "Nurse",
                        },
                        {
                            assignment_date: "2010-06-05",
                            assignment_employee_name: "Patrick",
                            assignment_shift: "Early",
                            assignment_skill: "Nurse",
                        },
                    ],
                }
            ],
        }

        schedule = create_schedule(fake_fs)
        self.assertEqual(filtering_by_name, schedule.filter_by_name())

    @patchfs
    def test_schedule_init(self, fake_fs):
        schedule = create_schedule(fake_fs)
        self.assertEqual(len(schedule.assignments_list), 2)

    @patchfs
    def test_export_schedule(self, fake_fs):
        schedule = create_schedule(fake_fs)
        expected_text = """ASSIGNMENTS
Patrick,2010-06-01,Late,Nurse
Patrick,2010-06-05,Early,Nurse
"""
        self.assertEqual(expected_text, schedule.export())
