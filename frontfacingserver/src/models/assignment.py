from constants import (
    assignment_date,
    assignment_employee_uname,
    assignment_shift,
    assignment_skill,
)
from src.models.exporter import CSVExporter


class Assignment(CSVExporter):
    def __init__(self, info):
        self.date = info[0]
        self.employee_uname = info[1]
        self.shift = info[2]
        self.skill = info[3]

    def to_json(self) -> dict:
        return {
            assignment_date: self.date,
            assignment_employee_uname: self.employee_uname,
            assignment_shift: self.shift,
            assignment_skill: self.skill,
        }

    def export(self):
        return f"{self.employee_uname},{self.date},{self.shift},{self.skill}\n"
