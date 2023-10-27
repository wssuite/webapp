import sys

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
        nurse_groups = []
        problem = {}
        with open(file_name, "r") as file:
            lines = iter(file.readlines())
            line = next(lines, None)
            while line is not None:
                if "SCHEDULING_PERIOD" in line:
                    line = next(lines)
                    profile_name, version, start, end = sanitize_array(line.split(','))
                    problem["startDate"] = start
                    problem["endDate"] = end
                    next(lines)  # skip END
                elif "SKILLS" in line:
                    line = next(lines).strip()
                    while "END" not in line:
                        new_skill = Skill().read_skill(line, profile_name)
                        skills.append(new_skill)
                        line = next(lines).strip()
                    problem["skills"] = [sk.username for sk in skills]
                elif "SHIFTS" in line:
                    line = next(lines).strip()
                    while "END" not in line:
                        new_shift = Shift().read_shift(line, profile_name)
                        shifts.append(new_shift)
                        line = next(lines).strip()
                elif "SHIFT_TYPES" in line:
                    line = next(lines).strip()
                    while "END" not in line:
                        new_shift_type = ShiftType().read_shift_type(
                            line, profile_name
                        )
                        shift_types.append(new_shift_type)
                        line = next(lines).strip()
                elif "SHIFT_GROUPS" in line:
                    line = next(lines).strip()
                    shift_type_names = [s.name for s in shift_types]
                    while "END" not in line:
                        new_shift_group = ShiftGroup().read_shift_group(
                            line, profile_name, shift_type_names
                        )
                        shift_groups.append(new_shift_group)
                        line = next(lines).strip()
                elif "CONTRACTS" in line:
                    line = next(lines)
                    while "END" not in line:
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
                    while "END" not in line:
                        c = ContractGroup().read_line(line)
                        contract_groups.append(c)
                        line = next(lines).strip()
                elif "EMPLOYEES" in line:
                    line = next(lines).strip()
                    while "END" not in line:
                        new_nurse = Nurse().read_nurse(
                            line, profile_name, contract_groups
                        )
                        new_nurse.name = new_nurse.username
                        nurses.append(new_nurse)
                        line = next(lines).strip()
                    problem["nurses"] = [n.username for n in nurses]

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
        return profile.to_json()


if __name__ == "__main__":
    file_path = sys.argv[1]
    importer = TXTImporter()
    go = importer.can_read_file(file_path)
    json = importer.read_file(file_path)
    print(json)
