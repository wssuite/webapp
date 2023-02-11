from src.cpp_utils.assignment import Assignment
import re

regex = r'{([a-zA-Z0-9\-]+),([a-zA-Z0-9\-]+),' \
        r'([a-zA-Z0-9\-]+),([a-zA-Z0-9\-]+)}'


class Schedule:

    def __init__(self, file_name):
        self.assignments_list = []
        with open(file_name) as stream:
            reader = stream.readlines()
            for row in reader:
                match = re.search(regex, row)
                if match:
                    groups = [match.group(1), match.group(2),
                              match.group(3), match.group(4)]
                    self.assignments_list.append(Assignment(groups))

    def filter_by_name(self):
        dict_filtered_name = {}
        for assignment in self.assignments_list:
            if assignment.employee_name not in dict_filtered_name:
                list_assignments = [assignment.to_json()]
                dict_filtered_name[assignment.employee_name] = list_assignments
            else:
                list_assignments = dict_filtered_name.\
                    get(assignment.employee_name)
                list_assignments.append(assignment.to_json())
                dict_filtered_name[assignment.employee_name] = list_assignments
        ret = []
        for key in dict_filtered_name.keys():
            ret_element = {"employee_name": key,
                           "assignments": dict_filtered_name.get(key)
                           }
            ret.append(ret_element)
        return ret
