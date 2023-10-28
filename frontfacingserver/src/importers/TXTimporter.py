import sys
from datetime import datetime

from src.importers.importer import BaseImporter
from src.models.contract import Contract
from src.models.contract_group import ContractGroup
from src.models.nurse import Nurse
from src.models.nurse_group import NurseGroup
from src.models.profile import DetailedProfile
from src.models.shift import Shift
from src.models.shift_group import ShiftGroup
from src.models.shift_type import ShiftType
from src.models.skill import Skill
from src.utils.import_util import sanitize_array, Wrapper, skip_line

shift_section_marker = "shifts"
shift_type_section_marker = "shift types"
shift_groups_section_marker = "shift groups"
contracts_section_marker = "contracts"
contract_groups_section_marker = "contract groups"
skills_section_marker = "skills"
nurses_section_marker = "nurses"
nurse_groups_section_marker = "nurse groups"


def date_to_js(sdate):
    date = datetime.fromisoformat(sdate)
    return date.strftime('%Y-{}-{}').format(date.month, date.day)


class TXTImporter(BaseImporter):
    def can_read_file(self, file_name):
        return file_name.endswith(".txt")

    def read_file(self, file_name):
        skills = []
        shifts = []
        shift_types = []
        shift_groups = []
        contracts = []
        contract_groups = []
        nurses = []
        nurse_names = {}
        nurse_groups = []
        problem = {}
        with open(file_name, "r") as file:
            lines = iter(file.readlines())
            line = next(lines, None)
            while line is not None:
                if "SCHEDULING_PERIOD" in line:
                    line = next(lines).strip()
                    profile_name, version, start, end = line.split(',')
                    problem["startDate"] = date_to_js(start)
                    problem["endDate"] = date_to_js(end)
                    next(lines)  # skip END
                elif "SKILLS" in line:
                    line = next(lines).strip()
                    while not line.startswith("END"):
                        new_skill = Skill().read_skill(line, profile_name)
                        skills.append(new_skill)
                        line = next(lines).strip()
                    problem["skills"] = [sk.name for sk in skills]
                elif "SHIFTS" in line:
                    line = next(lines).strip()
                    while not line.startswith("END"):
                        new_shift = Shift().read_shift(line, profile_name)
                        shifts.append(new_shift)
                        line = next(lines).strip()
                    problem["shifts"] = [s.name for s in shifts]
                elif "SHIFT_TYPES" in line:
                    line = next(lines).strip()
                    while not line.startswith("END"):
                        new_shift_type = ShiftType().read_shift_type(
                            line, profile_name
                        )
                        shift_types.append(new_shift_type)
                        line = next(lines).strip()
                elif "SHIFT_GROUPS" in line:
                    line = next(lines).strip()
                    shift_type_names = [s.name for s in shift_types]
                    while not line.startswith("END"):
                        new_shift_group = ShiftGroup().read_shift_group(
                            line, profile_name, shift_type_names
                        )
                        shift_groups.append(new_shift_group)
                        line = next(lines).strip()
                elif "CONTRACTS" in line:
                    line = next(lines)
                    while not line.startswith("END"):
                        if "{" in line:
                            contract = ""
                            line = next(lines)
                            while "}" not in line:
                                contract += line
                                line = next(lines)
                            new_contract = Contract().read_contract(profile_name, contract)
                            contracts.append(new_contract)
                        line = next(lines)
                elif "CONTRACT_GROUPS" in line:
                    line = next(lines).strip()
                    while not line.startswith("END"):
                        c = ContractGroup().read_line(line)
                        contract_groups.append(c)
                        line = next(lines).strip()
                elif "EMPLOYEES" in line:
                    line = next(lines).strip()
                    while not line.startswith("END"):
                        new_nurse = Nurse().read_nurse(
                            line, profile_name, contract_groups
                        )
                        new_nurse.name = new_nurse.username
                        nurses.append(new_nurse)
                        nurse_names[line.split(',')[0]] = new_nurse.username
                        line = next(lines).strip()
                    problem["nurses"] = list(nurse_names.values())
                elif "HOSPITAL_DEMAND" in line:
                    line = next(lines).strip()
                    if "hospitalDemand" in problem:
                        print("Ignore subsequent hospital demand")
                        while not line.startswith("END"):
                            line = next(lines)
                    else:
                        demand = []
                        while not line.startswith("END"):
                            tokens = line.split(',')
                            demand.append({
                                "date": date_to_js(tokens[0]),
                                "shift": tokens[1],
                                "skill": tokens[2],
                                "minValue": tokens[3],
                                "minWeight": tokens[4],
                                "maxValue": tokens[5],
                                "maxWeight": tokens[6],
                            })
                            line = next(lines).strip()
                        problem["hospitalDemand"] = demand
                elif "PREFERENCES" in line:
                    line = next(lines).strip()
                    preferences = []
                    while not line.startswith("END"):
                        tokens = line.split(',')
                        date = date_to_js(tokens[0])
                        nurse_name = nurse_names[tokens[1]]
                        p_shifts = problem["shifts"] if tokens[3] == "Any" or tokens[3] == "Rest" \
                            else [tokens[3]]
                        pref = tokens[2]
                        if tokens[3] == "Rest":
                            pref = "ON" if pref == "OFF" else "OFF"
                        weight = tokens[4]
                        for shift in p_shifts:
                            preferences.append({
                                "date": date,
                                "username": nurse_name,
                                "preference": pref,
                                "shift": shift,
                                "weight": weight,
                            })
                        line = next(lines).strip()
                    problem["preferences"] = preferences
                elif "HISTORY" in line:
                    line = next(lines).strip()
                    history = []
                    while not line.startswith("END"):
                        tokens = line.split(',')
                        nurse_name = nurse_names[tokens[1]]
                        history.append({
                            "date": date_to_js(tokens[0]),
                            "username": nurse_name,
                            "shift": tokens[2],
                        })
                        line = next(lines).strip()
                    problem["history"] = history

                # parse next line
                line = next(lines, None)

        profile = DetailedProfile()
        profile.name = profile_name
        profile.contracts = contracts
        profile.contract_groups = contract_groups
        profile.shifts = shifts
        profile.shift_types = shift_types
        profile.shift_groups = shift_groups
        profile.nurses = nurses
        profile.nurse_groups = []
        profile.skills = skills
        p_json = profile.to_json()

        p_json["problem"] = problem

        return p_json


if __name__ == "__main__":
    file_path = sys.argv[1]
    importer = TXTImporter()
    go = importer.can_read_file(file_path)
    json = importer.read_file(file_path)
    print(json)
