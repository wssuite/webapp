from src.cpp_utils.assignment import Assignment
import re

regex_assignments = r'([a-zA-Z0-9\-]+),([a-zA-Z0-9\-]+),' \
                    r'([a-zA-Z0-9\-]+),([a-zA-Z0-9\-]+)\n'

regex_instance_info = r'([a-zA-Z0-9\-\.]+),([a-zA-Z0-9\-]+),' \
                      r'([a-zA-Z0-9\-]+)\n'

regex_headers = r'\(([a-zA-Z0-9]+),\s*([a-zA-Z0-9]+)\)\n'


class Schedule:

    def __init__(self, file_name):
        self.assignments_list = []
        self.start_date = ""
        self.end_date = ""
        self.id_dict = {}
        with open(file_name) as stream:
            reader = stream.readlines()
            for row in reader:
                match_regex_assignments = re.search(regex_assignments, row)
                match_regex_instance_info = re.search(regex_instance_info, row)
                match_regex_headers = re.search(regex_headers, row)
                """the assignments block will be after the headers bloc"""
                if match_regex_assignments:
                    employee_name = self.id_dict.get(
                        match_regex_assignments.group(2))

                    groups = [match_regex_assignments.group(1),
                              employee_name,
                              match_regex_assignments.group(3),
                              match_regex_assignments.group(4)]

                    self.assignments_list.append(Assignment(groups))
                elif match_regex_headers:
                    self.id_dict[match_regex_headers.group(1)] =\
                        match_regex_headers.group(2)
                elif match_regex_instance_info:
                    self.start_date = match_regex_instance_info.group(2)
                    self.end_date = match_regex_instance_info.group(3)

    def filter_by_name(self):
        dict_filtered_name = {}
        for assignment in self.assignments_list:
            if assignment.employee_name not in dict_filtered_name:
                list_assignments = [assignment.to_json()]
                dict_filtered_name[assignment.employee_name] = list_assignments
            else:
                list_assignments = dict_filtered_name. \
                    get(assignment.employee_name)
                list_assignments.append(assignment.to_json())
                dict_filtered_name[assignment.employee_name] = list_assignments
        schedule = []
        for key in dict_filtered_name.keys():
            ret_element = {"employee_name": key,
                           "assignments": dict_filtered_name.get(key)
                           }
            schedule.append(ret_element)

        ret = {
            "startDate": self.start_date,
            "endDate": self.end_date,
            "schedule": schedule
        }
        return ret
