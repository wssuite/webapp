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
    schedule_contracts,
    schedule_shifts,
    schedule_shift_types,
    schedule_shift_groups,
    schedule_nurse_groups,
    schedule_contract_groups,
)
from src.models.shift_group import ShiftGroup
from src.models.shift import Shift
from src.models.shift_type import ShiftType
from src.models.nurse_group import NurseGroup
from src.models.nurse import Nurse
from src.models.contract import Contract
from src.models.contract_group import ContractGroup


class ScheduleDemand(Jsonify):
    start_date = StringField(serialized_name=schedule_start_date)
    end_date = StringField(serialized_name=schedule_end_date)
    profile = StringField(serialized_name=profile)
    hospital_demand = ObjectListField(
        HospitalDemandElement, schedule_hospital_demand
    )
    preferences = ObjectListField(NursePreferenceElement, schedule_pref)
    nurses = ListField(str, serialized_name=schedule_nurses)


class ScheduleDemandDetailed(Jsonify):
    start_date = StringField(serialized_name=schedule_start_date)
    end_date = StringField(serialized_name=schedule_end_date)
    profile = StringField(serialized_name=profile)
    hospital_demand = ObjectListField(
        HospitalDemandElement, schedule_hospital_demand
    )
    preferences = ObjectListField(NursePreferenceElement, schedule_pref)
    nurses = ObjectListField(Nurse, serialized_name=schedule_nurses)
    shifts = ObjectListField(Shift, serialized_name=schedule_shifts)
    shift_types = ObjectListField(
        ShiftType, serialized_name=schedule_shift_types
    )
    shift_groups = ObjectListField(
        ShiftGroup, serialized_name=schedule_shift_groups
    )
    contract_groups = ObjectListField(
        ContractGroup, serialized_name=schedule_contract_groups
    )
    contract = ObjectListField(Contract, serialized_name=schedule_contracts)
    nurse_groups = ObjectListField(
        NurseGroup, serialized_name=schedule_nurse_groups
    )
