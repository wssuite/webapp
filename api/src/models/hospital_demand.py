from src.models.hospital_demand_element import HospitalDemandElement
from src.models.nurse_preference_element import (
    NursePreferenceElement,
    NurseHistoryElement,
)
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
    schedule_contract_groups,
    schedule_skills,
    contract_section,
    contract_group_section,
    nurse_section,
    shift_group_section,
    shift_type_section,
    shift_section,
    end_section,
    hospital_demand_section,
    preferences_section,
    header_section,
    skill_section,
    schedule_history,
    history_section,
)
from src.models.shift_group import ShiftGroup
from src.models.shift import Shift
from src.models.shift_type import ShiftType
from src.models.nurse import Nurse
from src.models.contract import Contract
from src.models.contract_group import ContractGroup
from src.models.skill import Skill
from src.models.stringify import (
    Stringify,
    extract_string_from_complex_object_array,
)


class ScheduleDemand(Jsonify):
    start_date = StringField(serialized_name=schedule_start_date)
    end_date = StringField(serialized_name=schedule_end_date)
    profile = StringField(serialized_name=profile)
    hospital_demand = ObjectListField(HospitalDemandElement, schedule_hospital_demand)
    preferences = ObjectListField(NursePreferenceElement, schedule_pref)
    history = ObjectListField(NurseHistoryElement, schedule_history)
    nurses = ListField(str, serialized_name=schedule_nurses)
    skills = ListField(str, serialized_name=schedule_skills)
    shifts = ListField(str, serialized_name=schedule_shifts)

    def to_json(self):
        h_d = [d.to_json() for d in self.hospital_demand]
        pref = [p.to_json() for p in self.preferences]
        history = [h.to_json() for h in self.history]
        return {
            schedule_nurses: self.nurses,
            schedule_skills: self.skills,
            schedule_shifts: self.shifts,
            schedule_pref: pref,
            profile: self.profile,
            schedule_history: history,
            schedule_start_date: self.start_date,
            schedule_end_date: self.end_date,
            schedule_hospital_demand: h_d,
        }


class ScheduleDemandDetailed(ScheduleDemand, Stringify):
    id = ""
    shift_types = ObjectListField(
        ShiftType, serialized_name=schedule_shift_types
    )
    shift_groups = ObjectListField(
        ShiftGroup, serialized_name=schedule_shift_groups
    )
    contract_groups = ObjectListField(
        ContractGroup, serialized_name=schedule_contract_groups
    )
    contracts = ObjectListField(Contract, serialized_name=schedule_contracts)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.hospital_demand = []
        self.preferences = []
        self.nurses = []
        self.contracts = []
        self.contract_groups = []
        self.shift_types = []
        self.skills = []
        self.shifts = []
        self.shift_groups = []
        self.history = []

    def to_string(self):
        header_sec = self.__develop_header_section()
        info_sec = self.__develop_info_section()
        contract_sec = ScheduleDemandDetailed.__develop_section(
            self.contracts, contract_section
        )
        skill_sec = ScheduleDemandDetailed.__develop_section(
            self.skills, skill_section
        )
        nurse_sec = ScheduleDemandDetailed.__develop_section(
            self.nurses, nurse_section
        )
        contract_group_sec = ScheduleDemandDetailed.__develop_section(
            self.contract_groups, contract_group_section
        )
        shift_sec = ScheduleDemandDetailed.__develop_section(
            self.shifts, shift_section
        )
        shift_group_sec = ScheduleDemandDetailed.__develop_section(
            self.shift_groups, shift_group_section
        )
        shift_type_sec = ScheduleDemandDetailed.__develop_section(
            self.shift_types, shift_type_section
        )
        hospital_demand_sec = self.__develop_hospital_demand(
            hospital_demand_section
        )
        preferences_sec = ScheduleDemandDetailed.__develop_section(
            self.preferences, preferences_section
        )
        history_sec = ScheduleDemandDetailed.__develop_section(
            self.history, history_section
        )
        return (
            f"{header_sec}{info_sec}{skill_sec}{shift_sec}{shift_group_sec}"
            f"{shift_type_sec}{contract_sec}{contract_group_sec}"
            f"{nurse_sec}{hospital_demand_sec}"
            f"{preferences_sec}{history_sec}"
        )

    def __develop_hospital_demand(self, identifier):
        demands = []
        for e in self.hospital_demand:
            while e.index >= len(demands):
                demands.append([])
            demands[e.index].append(e)
        ret_string = ""
        for demand in demands:
            ret_string += f"{identifier}\n"
            ret_string += extract_string_from_complex_object_array(demand)
            ret_string += f"{end_section}\n"
        return ret_string

    @staticmethod
    def __develop_section(array, identifier):
        ret_string = f"{identifier}\n"
        ret_string += extract_string_from_complex_object_array(array)
        ret_string += f"{end_section}\n"
        return ret_string

    def __develop_header_section(self):
        ret_string = f"{header_section}\n"
        for nurse in self.nurses:
            ret_string += f"({nurse.id},{nurse.username})\n"
        ret_string += f"{end_section}\n"
        return ret_string

    def __develop_info_section(self):
        header = "SCHEDULING_PERIOD"
        return (
            f"{header}\n{self.profile},{self.id},"
            f"{self.start_date},{self.end_date}\n{end_section}\n"
        )

    def set_from_schedule_demand(self, schedule_demand: ScheduleDemand):
        self.profile = schedule_demand.profile
        self.start_date = schedule_demand.start_date
        self.end_date = schedule_demand.end_date
