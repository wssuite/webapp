from src.models.jsonify import Jsonify
from pykson import StringField
from constants import (
    demand_day,
    demand_date,
    demand_shift,
    demand_max_value,
    demand_max_weight,
    demand_min_weight,
    demand_min_value,
    demand_skill,
)
from src.models.stringify import Stringify


class HospitalDemandElement(Jsonify, Stringify):
    date = StringField(serialized_name=demand_date)
    day = StringField(serialized_name=demand_day)
    shift = StringField(serialized_name=demand_shift)
    skill = StringField(serialized_name=demand_skill)
    min_value = StringField(serialized_name=demand_min_value)
    min_weight = StringField(serialized_name=demand_min_weight)
    max_value = StringField(serialized_name=demand_max_value)
    max_weight = StringField(serialized_name=demand_max_weight)

    def to_string(self):
        return (
            f"{self.date},{self.day},{self.shift},"
            f"{self.skill},{self.min_value},{self.min_weight},"
            f"{self.max_value}{self.max_weight}\n"
        )
