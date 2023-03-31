from constants import (
    assignment_date,
    assignment_employee_name,
    assignment_shift,
    assignment_skill,
)
from src.models.exporter import CSVExporter


class Assignment(CSVExporter):
    def __init__(self, info):
        self.date = info[0]
        self.employee_name = info[1]
        self.shift = info[2]
        self.skill = info[3]

    def to_json(self) -> dict:
        return {
            assignment_date: self.date,
            assignment_employee_name: self.employee_name,
            assignment_shift: self.shift,
            assignment_skill: self.skill,
        }

    def export(self):
        return f"{self.employee_name},{self.date},{self.shift},{self.skill}\n"
