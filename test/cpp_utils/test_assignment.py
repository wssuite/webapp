from src.cpp_utils.assignment import Assignment
from unittest import TestCase


class TestAssignment(TestCase):
    def setUp(self) -> None:
        self.assignment_info = ["2023-03-02", "Patrick", "Early", "Nurse"]

    def tearDown(self) -> None:
        pass

    def test_assignment_creation(self):
        assignment = Assignment(self.assignment_info)
        self.assertEqual(assignment.date, self.assignment_info[0])
        self.assertEqual(assignment.employee_name, self.assignment_info[1])
        self.assertEqual(assignment.shift, self.assignment_info[2])
        self.assertEqual(assignment.skill, self.assignment_info[3])

    def test_assignment_json_presentation(self):
        assignment = Assignment(self.assignment_info)
        assignment_json = {
            "date": self.assignment_info[0],
            "employee_name": self.assignment_info[1],
            "shift": self.assignment_info[2],
            "skill": self.assignment_info[3]
        }
        self.assertEqual(assignment.to_json(), assignment_json)
