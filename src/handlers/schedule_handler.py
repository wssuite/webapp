import json
import os.path
from typing import Type

from src.exceptions.project_base_exception import ProjectBaseException
from src.handlers.base_handler import BaseHandler
from src.models.hospital_demand import ScheduleDemandDetailed, ScheduleDemand
from src.models.nurse import Nurse
from src.models.contract import Contract
from src.models.nurse_group import NurseGroup
from src.models.contract_group import ContractGroup
from src.models.shift_group import ShiftGroup
from src.models.shift_type import ShiftType
from src.models.shift import Shift
from src.models.skill import Skill
from src.models.jsonify import Jsonify
from constants import profile, start_date, end_date
from src.utils.file_system_manager import FileSystemManager


class ScheduleHandler(BaseHandler):
    def __init__(self, mongo):
        super().__init__(mongo)

    def generate_schedule(self, token, demand_json):
        demand = ScheduleDemand().from_json(demand_json)
        self.verify_profile_accessors_access(token, demand.profile)

        """Get th path for next version"""
        (
            full_path,
            next_version,
        ) = FileSystemManager.get_path_to_generate_schedule(
            demand_json[profile],
            demand_json[start_date],
            demand_json[end_date],
        )
        detailed_demand = ScheduleDemandDetailed()

        input_json = os.path.join(full_path, "input.json")
        """Dump the demand in an input.json file"""
        with open(input_json, "w") as f:
            json.dump(demand.to_json(), f)

        detailed_demand.id = next_version
        self.__build_detailed_demand(demand, detailed_demand)

        input_txt = os.path.join(full_path, "input.txt")
        with open(input_txt, "w") as f:
            f.write(detailed_demand.to_string())

        return str(next_version)

    def get_input_problem_path(self, token, profile_name, start, end, version):
        self.verify_profile_accessors_access(token, profile_name)
        fs = FileSystemManager()
        path = fs.get_input_problem_path(profile_name, start, end, version)
        if fs.exist(path):
            return path
        else:
            raise ProjectBaseException("The problem doesn't exist")

    def __build_detailed_demand(self, demand, detailed_demand):
        nurse_groups = self.nurse_group_dao.fetch_all(demand.profile)
        """Get the nurses objects included in the demand"""
        for nurse in demand.nurses:
            nurse_dict = self.nurse_dao.find_by_username(nurse, demand.profile)
            if nurse is not None:
                nurse_object = Nurse().from_json(nurse_dict)
                for nurse_group in nurse_groups:
                    nurse_group_object = NurseGroup().from_json(nurse_group)
                    if nurse in nurse_group_object.nurses:
                        nurse_object.direct_contracts.extend(
                            nurse_group_object.contracts
                        )
                        nurse_object.contract_groups.extend(
                            nurse_group_object.contract_groups
                        )

                detailed_demand.nurses.append(nurse_object)

        detailed_demand.set_from_schedule_demand(demand)

        """Filter the demand and the preferences before appending them
         to the detailed demand"""
        for preference in demand.preferences:
            """Get the nurse for the given preference"""
            nurse_dict = self.nurse_dao.find_by_username(
                preference.username, demand.profile
            )
            """if the nurse is found the dict will not be empty and we can
             proceed to verify the shift """
            if nurse_dict is not None:
                nurse_obj = Nurse().from_json(nurse_dict)
                preference.id = nurse_obj.id
                shift_exist = self.shift_dao.exist(
                    preference.shift, demand.profile
                )
                if shift_exist is True or preference.shift.lower() == "any":
                    detailed_demand.preferences.append(preference)

        for element in demand.hospital_demand:
            skill_exist = self.skill_dao.exist(element.skill, demand.profile)
            shift_exist = self.shift_dao.exist(element.shift, demand.profile)
            if skill_exist is True and shift_exist is True:
                detailed_demand.hospital_demand.append(element)

        contracts = self.contract_dao.fetch_all(demand.profile)
        contract_groups = self.contract_group_dao.fetch_all(demand.profile)
        skills = self.skill_dao.get_all(demand.profile)
        shifts = self.shift_dao.fetch_all(demand.profile)
        shift_types = self.shift_type_dao.fetch_all(demand.profile)
        shift_groups = self.shift_group_dao.fetch_all(demand.profile)

        ScheduleHandler.add_object_to_demand_list(
            contracts, Contract, detailed_demand.contracts
        )
        ScheduleHandler.add_object_to_demand_list(
            contract_groups, ContractGroup, detailed_demand.contract_groups
        )
        ScheduleHandler.add_object_to_demand_list(
            skills, Skill, detailed_demand.skills
        )
        ScheduleHandler.add_object_to_demand_list(
            shifts, Shift, detailed_demand.shifts
        )
        ScheduleHandler.add_object_to_demand_list(
            shift_groups, ShiftGroup, detailed_demand.shift_groups
        )
        ScheduleHandler.add_object_to_demand_list(
            shift_types, ShiftType, detailed_demand.shift_types
        )

    @staticmethod
    def add_object_to_demand_list(
        array, object_type: Type[Jsonify], destination
    ):
        for element in array:
            t = object_type().from_json(element)
            destination.append(t)
