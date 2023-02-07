from assignment import Assignment
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
        ret = {}
        for assignment in self.assignments_list:
            if assignment.employee_name not in ret:
                list_assignments = [assignment.to_json()]
                ret[assignment.employee_name] = list_assignments
            else:
                list_assignments = ret.get(assignment.employee_name)
                list_assignments.append(assignment.to_json())
                ret[assignment.employee_name] = list_assignments
        return ret
