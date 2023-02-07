class Assignment:
    date = ""
    employee_name = ""
    shift = ""
    skill = ""

    def __init__(self, info):
        self.date = info[0]
        self.employee_name = info[1]
        self.shift = info[2]
        self.skill = info[3]

    def to_json(self) -> dict:
        return {
            "date": self.date,
            "employee_name": self.employee_name,
            "shift": self.shift,
            "skill": self.skill
        }
