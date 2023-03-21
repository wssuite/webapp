from typing import List

from src.models.exporter import CSVExporter
from src.models.contract import Contract
from src.models.contract_group import ContractGroup
from src.models.jsonify import Jsonify
from src.models.db_document import DBDocument
from pykson import StringField, ListField, ObjectListField
from constants import (
    profile_name,
    profile_creator,
    profile_access,
    profile_contracts,
    profile_shifts,
    profile_contract_groups,
    profile_shift_types,
    profile_shift_groups,
    profile_nurses,
    profile_nurse_groups,
    profile_skills,
)
from src.models.nurse import Nurse
from src.models.nurse_group import NurseGroup
from src.models.shift import Shift
from src.models.shift_group import ShiftGroup
from src.models.shift_type import ShiftType
from src.models.skill import Skill


class Profile(Jsonify, DBDocument):
    name = StringField(serialized_name=profile_name)
    access = ListField(str, serialized_name=profile_access)
    creator = StringField(serialized_name=profile_creator)

    def db_json(self) -> dict:
        json = self.to_json()
        json[profile_access] = self.access
        return json

    def to_json(self):
        return {
            profile_name: self.name,
            profile_creator: self.creator,
        }


class DetailedProfile(Jsonify, CSVExporter):
    name = StringField(serialized_name=profile_name)
    contracts = ObjectListField(Contract, serialized_name=profile_contracts)
    shifts = ObjectListField(Shift, serialized_name=profile_shifts)
    contract_groups = ObjectListField(
        ContractGroup, serialized_name=profile_contract_groups
    )
    shift_types = ObjectListField(
        ShiftType, serialized_name=profile_shift_types
    )
    shift_groups = ObjectListField(
        ShiftGroup, serialized_name=profile_shift_groups
    )
    nurses = ObjectListField(Nurse, serialized_name=profile_nurses)
    nurse_groups = ObjectListField(
        NurseGroup, serialized_name=profile_nurse_groups
    )
    skills = ObjectListField(Skill, serialized_name=profile_skills)

    def to_json(self):
        contracts_json = DetailedProfile.__get_json_list__(self.contracts)
        shifts_json = DetailedProfile.__get_json_list__(self.shifts)
        contract_groups_json = DetailedProfile.__get_json_list__(
            self.contract_groups
        )
        shift_types_json = DetailedProfile.__get_json_list__(self.shift_types)
        shift_groups_json = DetailedProfile.__get_json_list__(
            self.shift_groups
        )
        nurses_json = DetailedProfile.__get_json_list__(self.nurses)
        nurse_groups_json = DetailedProfile.__get_json_list__(
            self.nurse_groups
        )
        skills_json = DetailedProfile.__get_json_list__(self.skills)
        return {
            profile_name: self.name,
            profile_contracts: contracts_json,
            profile_shifts: shifts_json,
            profile_contract_groups: contract_groups_json,
            profile_shift_types: shift_types_json,
            profile_shift_groups: shift_groups_json,
            profile_nurses: nurses_json,
            profile_nurse_groups: nurse_groups_json,
            profile_skills: skills_json,
        }

    def from_json(self, data):
        detailed = super(DetailedProfile, self).from_json(data)
        contracts = data[profile_contracts]
        detailed.contracts = []
        for contract in contracts:
            contract_obj = Contract().from_json(contract)
            detailed.contracts.append(contract_obj)
        return detailed

    def export(self):
        ret_str = f"profile\nname,{self.name}\n"
        ret_str += "skills\n"
        ret_str += DetailedProfile.__get_export_str(self.skills)
        ret_str += "shifts\n"
        ret_str += DetailedProfile.__get_export_str(self.shifts)
        ret_str += "shift types\n"
        ret_str += DetailedProfile.__get_export_str(self.shift_types)
        ret_str += "shift groups\n"
        ret_str += DetailedProfile.__get_export_str(self.shift_groups)
        ret_str += "contracts\n"
        ret_str += DetailedProfile.__get_export_str(self.contracts)
        ret_str += "contract groups\n"
        ret_str += DetailedProfile.__get_export_str(self.contract_groups)
        ret_str += "nurses\n"
        ret_str += DetailedProfile.__get_export_str(self.nurses)
        ret_str += "nurse groups\n"
        ret_str += DetailedProfile.__get_export_str(self.nurse_groups)
        return ret_str

    @staticmethod
    def __get_json_list__(objects):
        ret = []
        for obj in objects:
            ret.append(obj.to_json())

        return ret

    @staticmethod
    def __get_export_str(objects: List[CSVExporter]):
        ret = ""
        for obj in objects:
            ret += obj.export()
        return ret
