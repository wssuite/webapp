from src.models.assignment import Assignment
import re
from constants import (
    start_date,
    end_date,
    schedule_string,
    assignment_employee_name,
    assignments_string,
)
from src.models.exporter import CSVExporter

regex_assignments = (
    r"([a-zA-Z0-9\-]+),([a-zA-Z0-9\-]+),"
    r"([a-zA-Z0-9\-]+),([a-zA-Z0-9\-]+)\n"
)

regex_headers = r"\(([a-zA-Z0-9]+),\s*([a-zA-Z0-9]+)\)\n"


class Schedule(CSVExporter):
    def __init__(self, file_name):
        self.assignments_list = []
        self.start_date = ""
        self.end_date = ""
        self.id_dict = {}
        is_assignments = False
        with open(file_name) as stream:
            reader = stream.readlines()
            for row in reader:
                match_regex_assignments = re.search(regex_assignments, row)
                match_regex_headers = re.search(regex_headers, row)
                """the assignments block will be after the headers bloc"""
                if match_regex_assignments:
                    if is_assignments is True:
                        employee_name = self.id_dict.get(
                            match_regex_assignments.group(1)
                        )

                        groups = [
                            match_regex_assignments.group(2),
                            employee_name,
                            match_regex_assignments.group(3),
                            match_regex_assignments.group(4),
                        ]

                        self.assignments_list.append(Assignment(groups))
                    else:
                        self.start_date = match_regex_assignments.group(3)
                        self.end_date = match_regex_assignments.group(4)
                elif match_regex_headers:
                    self.id_dict[
                        match_regex_headers.group(1)
                    ] = match_regex_headers.group(2)
                elif row.upper().__contains__(assignments_string.upper()):
                    is_assignments = True

    def filter_by_name(self):
        dict_filtered_name = {}
        for assignment in self.assignments_list:
            if assignment.employee_name not in dict_filtered_name:
                list_assignments = [assignment.to_json()]
                dict_filtered_name[assignment.employee_name] = list_assignments
            else:
                list_assignments = dict_filtered_name.get(
                    assignment.employee_name
                )
                list_assignments.append(assignment.to_json())
                dict_filtered_name[assignment.employee_name] = list_assignments
        schedule = []
        for key in dict_filtered_name.keys():
            ret_element = {
                assignment_employee_name: key,
                assignments_string: dict_filtered_name.get(key),
            }
            schedule.append(ret_element)

        ret = {
            start_date: self.start_date,
            end_date: self.end_date,
            schedule_string: schedule,
        }
        return ret

    def export(self):
        ret_string = "ASSIGNMENTS\n"
        for assignment in self.assignments_list:
            ret_string += assignment.export()
        return ret_string
