from src.models.hospital_demand_element import HospitalDemandElement
from src.models.nurse_preference_element import NursePreferenceElement
from src.models.jsonify import Jsonify
from pykson import ObjectListField, ListField, StringField
from constants import (
    profile,
    schedule_start_date,
    schedule_end_date,
    schedule_nurses,
    schedule_hospital_demand,
    schedule_pref,
)


class ScheduleDemand(Jsonify):
    start_date = StringField(serialized_name=schedule_start_date)
    end_date = StringField(serialized_name=schedule_end_date)
    profile = StringField(serialized_name=profile)
    hospital_demand = ObjectListField(
        HospitalDemandElement, schedule_hospital_demand
    )
    preferences = ObjectListField(NursePreferenceElement, schedule_pref)
    nurses = ListField(str, serialized_name=schedule_nurses)
