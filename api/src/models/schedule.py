from src.models.assignment import Assignment
import re
from constants import (
    planning_field,
    start_date,
    end_date,
    schedule_string,
    assignment_employee_uname,
    assignments_string,
    regex_nurse_username,
    profile_name,
    version,
    state,
    timestamp
)
from src.models.exporter import CSVExporter

regex_assignments = (
    r"([a-zA-Z0-9\-\.]+),([a-zA-Z0-9\-\.]+),"
    r"([a-zA-Z0-9\-\.]+),([a-zA-Z0-9\-\.]+)\n"
)

regex_headers = r"\(([a-zA-Z0-9]+),\s*({})\)\n".format(regex_nurse_username)


class Schedule(CSVExporter):
    def __init__(self, file_name, load_assignments=True):
        self.assignments_list = []
        self.profile = ""
        self.version = ""
        self.start_date = ""
        self.end_date = ""
        self.id_dict = {}
        self.report = ""
        is_report = False
        is_assignments = False
        is_planning = False
        with open(file_name) as stream:
            reader = stream.readlines()
            for row in reader:
                match_regex_assignments = re.search(regex_assignments, row)
                match_regex_headers = re.search(regex_headers, row)
                """the assignments block will be after the headers bloc"""
                if match_regex_assignments:
                    if load_assignments and is_assignments is True:
                        employee_uname = self.id_dict.get(
                            match_regex_assignments.group(1)
                        )

                        groups = [
                            match_regex_assignments.group(2),
                            employee_uname,
                            match_regex_assignments.group(3),
                            match_regex_assignments.group(4),
                        ]

                        self.assignments_list.append(Assignment(groups))
                    elif is_planning:
                        self.profile = match_regex_assignments.group(1)
                        self.version = match_regex_assignments.group(2)
                        self.start_date = match_regex_assignments.group(3)
                        self.end_date = match_regex_assignments.group(4)
                        is_planning = False

                elif match_regex_headers:
                    self.id_dict[
                        match_regex_headers.group(1)
                    ] = match_regex_headers.group(2)

                elif row.upper().__contains__(assignments_string.upper()):
                    is_assignments = True

                elif row.upper().__contains__(planning_field.upper()):
                    is_planning = True

                if is_report is True and row.upper().__contains__("END") is False:
                    self.report += row

                if row.upper().__contains__("REPORT"):
                    is_report = True

    def get_statistics(self):
        return eval(self.report)

    def filter_by_name(self):
        dict_filtered_name = {}
        for assignment in self.assignments_list:
            if assignment.employee_uname not in dict_filtered_name:
                dict_filtered_name[assignment.employee_uname] = [assignment.to_json()]
            else:
                dict_filtered_name[assignment.employee_uname].append(assignment.to_json())
        schedule = []
        for key in dict_filtered_name.keys():
            ret_element = {
                assignment_employee_uname: key,
                assignments_string: dict_filtered_name.get(key),
            }
            schedule.append(ret_element)

        ret = {
            start_date: self.start_date,
            end_date: self.end_date,
            schedule_string: schedule,
        }
        return ret

    def profile_json(self):
        return {
            start_date: self.start_date,
            end_date: self.end_date,
            profile_name: self.profile,
            version: self.version
        }

    def export(self):
        ret_string = "ASSIGNMENTS\n"
        for assignment in self.assignments_list:
            ret_string += assignment.export()
        ret_string += "REPORT\n"
        ret_string += self.report
        return ret_string
