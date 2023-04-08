import datetime
import json
import os.path
from typing import Type

import requests

from src.models.schedule import Schedule
from src.models.solution import Solution
from src.exceptions.project_base_exception import ProjectBaseException
from src.handlers.base_handler import BaseHandler
from src.models.hospital_demand import (
    ScheduleDemandDetailed,
    ScheduleDemand,
)
from src.models.nurse import Nurse
from src.models.contract import Contract
from src.models.nurse_group import NurseGroup
from src.models.contract_group import ContractGroup
from src.models.shift_group import ShiftGroup
from src.models.shift_type import ShiftType
from src.models.shift import Shift
from src.models.skill import Skill
from src.models.jsonify import Jsonify
from constants import (
    profile,
    start_date,
    end_date,
    version,
    previous_versions,
    problem,
    schedule,
    state,
    timestamp,
)
from src.utils.file_system_manager import FileSystemManager, base_directory


class ScheduleHandler(BaseHandler):
    def __init__(self, mongo):
        super().__init__(mongo)

    def __generate_schedule(self, token, demand_json, v):
        demand = ScheduleDemand().from_json(demand_json)
        self.verify_profile_accessors_access(token, demand.profile)

        config = open("config.json")
        data = json.load(config)
        config.close()
        generate_url = f"http://{data['haproxy_address']}/solver/schedule"

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
        with open(input_txt, "w") as f1:
            f1.write(detailed_demand.to_string())

        os.mkdir(os.path.join(full_path, "sol"))
        instance_path = os.path.join(full_path, "sol")
        instance_txt = os.path.join(instance_path, "sol.txt")
        with open(instance_txt, "w") as f2:
            f2.write(detailed_demand.to_string())
        time = datetime.datetime.now().astimezone()
        time_str = str(time).split(".")[0]
        solution_json = {
            start_date: demand.start_date,
            end_date: demand.end_date,
            profile: demand.profile,
            version: str(next_version),
            timestamp: time_str,
        }
        """This will be the case of a schedule regeneration"""
        if v is not None:
            previous_solution = self.solution_dao.get_solution(
                demand.start_date, demand.end_date, demand.profile, v
            )
            previous_version_array = previous_solution[previous_versions]
            previous_version_array.append(v)
            solution_json[previous_versions] = previous_version_array

        solution_object = Solution().from_json(solution_json)
        relative_path = full_path.replace(base_directory, "")
        response = requests.post(generate_url, params={"path": relative_path})
        if response.status_code == 200:
            solution_object.worker_host = response.text
            solution_object.state = "Waiting"
            self.solution_dao.insert_one(solution_object.db_json())
        else:
            solution_object.state = "Failed"
            self.solution_dao.insert_one(solution_object.db_json())
            raise ProjectBaseException(
                "Try later an error occurred during processing"
            )
        return solution_object.to_json()

    def generate_schedule(self, token, demand_json):
        return self.__generate_schedule(token, demand_json, None)

    def regenerate_schedule(self, token, demand_json, v):
        return self.__generate_schedule(token, demand_json, v)

    def stop_generation(self, token, solution_json):
        solution = Solution().from_json(solution_json)
        self.verify_profile_accessors_access(token, solution.profile)
        solution_from_db = self.solution_dao.get_solution(
            solution.start_date,
            solution.end_date,
            solution.profile,
            solution.version,
        )
        db_solution = Solution().from_json(solution_from_db)
        """
          TODO send the request to stop to the worker in question
        """
        host = db_solution.worker_host
        stop_url = f"http://{host}/solver/stop"
        full_path = FileSystemManager.get_solution_dir_path(
            db_solution.profile,
            db_solution.start_date,
            db_solution.end_date,
            db_solution.version,
        )
        relative_path = full_path.replace(base_directory, "")
        requests.post(stop_url, params={"path": relative_path})

    def get_detailed_solution(self, token, start, end, profile_name, v):
        self.verify_profile_accessors_access(token, profile_name)
        solution_db = self.solution_dao.get_solution(
            start, end, profile_name, v
        )
        so = Solution().from_json(solution_db)
        previous_versions_detailed = []
        for previous_version in so.previous_versions:
            pv = self.solution_dao.get_solution(
                start, end, profile_name, previous_version
            )
            if pv is not None:
                pvo = Solution().from_json(pv)
                previous_versions_detailed.append(pvo.to_json())

        ret_json = so.to_json()
        ret_json[previous_versions] = previous_versions_detailed
        """TODO: Get the schedule and the request from the file system"""
        fsm = FileSystemManager()
        dir_path = fsm.get_solution_dir_path(profile_name, start, end, v)
        input_json_file = os.path.join(dir_path, "input.json")
        schedule_file = os.path.join(dir_path, "sol.txt")
        try:
            file = open(input_json_file)
            input_json = json.load(file)
            file.close()
            ret_json[problem] = input_json
            schedule_obj = Schedule(schedule_file)
            ret_json[schedule] = schedule_obj.filter_by_name()

            return ret_json
        except OSError:
            return ret_json

    def get_latest_solutions_versions(self, token, profile_name):
        self.verify_profile_accessors_access(token, profile_name)
        return self.solution_dao.get_latest_versions(profile_name)

    def get_all_solutions(self, token, profile_name):
        self.verify_profile_accessors_access(token, profile_name)
        return self.solution_dao.fetch_all(profile_name)

    def get_input_problem_path(self, token, profile_name, start, end, v):
        self.verify_profile_accessors_access(token, profile_name)
        fs = FileSystemManager()
        path = fs.get_input_problem_path(profile_name, start, end, v)
        if fs.exist(path):
            return path
        else:
            raise ProjectBaseException("The problem doesn't exist")

    def remove_schedule(self, token, start, end, profile_name, v):
        self.verify_profile_accessors_access(token, profile_name)
        fs = FileSystemManager()
        """Before removing the solution update next versions to
        not consider the version that is about to be deleted"""
        next_versions = self.solution_dao.get_next_versions(
            start, end, profile_name, v
        )
        self.solution_dao.remove(start, end, profile_name, v)
        for next_version in next_versions:
            solution = self.solution_dao.get_solution(
                next_version[start_date],
                next_version[end_date],
                next_version[profile],
                next_version[version],
            )
            list_to_update = solution[previous_versions]
            list_to_update.remove(v)
            self.solution_dao.update_previous_versions_array(
                next_version[start_date],
                next_version[end_date],
                next_version[profile],
                next_version[version],
                list_to_update,
            )

        path = fs.get_solution_dir_path(profile_name, start, end, v)
        if fs.exist(path):
            fs.delete_dir(path)
        else:
            raise ProjectBaseException("The problem doesn't exist")

    def export_schedule(self, token, start, end, profile_name, v):
        self.verify_profile_accessors_access(token, profile_name)
        fs = FileSystemManager()
        sol_dir_path = fs.get_solution_dir_path(profile_name, start, end, v)
        sol_file = os.path.join(sol_dir_path, "sol.txt")
        solution = Schedule(sol_file)
        return solution.export()

    def export_std_error(self, token, start, end, profile_name, v):
        self.verify_profile_accessors_access(token, profile_name)
        fs = FileSystemManager()
        sol_dir_path = fs.get_solution_dir_path(profile_name, start, end, v)
        err_dir_path = os.path.join(sol_dir_path, "error.txt")
        try:
            str_error = ""
            with open(err_dir_path) as f:
                lines = f.readlines()
                for line in lines:
                    str_error += f"{line}"
            return str_error
        except Exception:
            raise ProjectBaseException("No errors were found")

    def __build_detailed_demand(self, demand, detailed_demand):
        nurse_groups = self.nurse_group_dao.fetch_all(demand.profile)
        """Get the nurses objects included in the demand"""
        counter = 0
        username_id_dict = {}
        for nurse in demand.nurses:
            nurse_dict = self.nurse_dao.find_by_username(nurse, demand.profile)
            if nurse_dict is not None:
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
                nurse_object.id = str(counter)
                username_id_dict[nurse_object.username] = nurse_object.id
                counter += 1
                detailed_demand.nurses.append(nurse_object)

        detailed_demand.set_from_schedule_demand(demand)

        """Filter the demand and the preferences before appending them
         to the detailed demand"""
        for preference in demand.preferences:
            """Get the nurse for the given preference"""
            preference_id = username_id_dict.get(preference.username)
            """if the nurse is found the dict will not be empty and we can
             proceed to verify the shift """
            if preference_id is not None:
                preference.id = preference_id
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
            contract_groups,
            ContractGroup,
            detailed_demand.contract_groups,
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

    def update_solution_state(self, solution_json):
        self.solution_dao.update_state(
            solution_json[start_date],
            solution_json[end_date],
            solution_json[profile],
            solution_json[version],
            solution_json[state],
        )
        return os.path.join(
            solution_json[profile],
            f"{solution_json[start_date]}_{solution_json[end_date]}",
            solution_json[version],
        )
