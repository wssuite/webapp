from pykson import ObjectListField, ListField, StringField
from src.example.Personnel import Personnel
from src.example.Writable import Writable


class Scenario(Writable):
    scenario_name = StringField(serialized_name="scenario_name")
    staff = ObjectListField(Personnel, serialized_name="staff")
    constraints = ListField(str, serialized_name="constraints")

    def __repr__(self):
        staff_str = ""
        constraints_str = ""
        for personnel in self.staff:
            staff_str += f"{personnel}\n"
        for constraint in self.constraints:
            constraints_str += f"{constraint}\n"
        ret = f"Scenario name = {self.scenario_name} \n\n" \
              f"Staff\n{staff_str} \n \n" \
              f"Constraints\n{constraints_str}"
        return ret

    def from_json(self, data_dict: dict):
        return super(Scenario, self).from_json(data_dict)
