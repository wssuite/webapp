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


class HospitalDemandElement(Jsonify):
    date = StringField(serialized_name=demand_date)
    day = StringField(serialized_name=demand_day)
    shift = StringField(serialized_name=demand_shift)
    skill = StringField(serialized_name=demand_skill)
    min_value = StringField(serialized_name=demand_min_value)
    min_weight = StringField(serialized_name=demand_min_weight)
    max_value = StringField(serialized_name=demand_max_value)
    max_weight = StringField(serialized_name=demand_max_weight)
