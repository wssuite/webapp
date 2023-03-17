from pyfakefs import fake_filesystem_unittest
from pyfakefs.fake_filesystem_unittest import patchfs

from constants import (
    contract_name,
    contract_constraints,
    constraint_name,
    number_of_free_days_after_shift,
    integer_constraint_value,
    constraint_weight,
    shift_constraint,
    unwanted_skills,
    contract_skills,
    total_weekends_in_four_weeks,
    max_constraint_value,
    max_constraint_weight,
    min_constraint_value,
    min_constraint_weight,
    min_max_num_assignments_in_four_weeks,
    min_max_consecutive_weekends,
    min_max_consecutive_shift_type,
    identical_shift_during_weekend,
    complete_weekends,
    unwanted_pattern,
    unwanted_pattern_elements,
    pattern_element_shift,
    pattern_element_day,
    alternative_shift,
    profile,
    profile_name,
    profile_contracts,
    profile_shifts,
    profile_shift_types,
    profile_shift_groups,
    profile_skills,
    profile_nurses,
    profile_nurse_groups,
    profile_contract_groups,
)
from src.importers.importer import CSVImporter
from test_constants import (
    profile1,
    early_shift,
    late_shift,
    day_shift_type,
    night_shift_type,
    work_shift_group,
    rest_shift_group,
    nurse_skill,
    sociologist_skill,
    head_nurse_skill,
)


class TestCSVImporter(fake_filesystem_unittest.TestCase):
    def setUp(self) -> None:
        self.setUpPyfakefs()
        self.expected_contracts = [
            {
                contract_name: "FullTime",
                contract_constraints: [
                    {
                        constraint_name: number_of_free_days_after_shift,
                        integer_constraint_value: "1.0",
                        constraint_weight: "hard",
                        shift_constraint: "Early",
                    },
                    {
                        constraint_name: unwanted_skills,
                        contract_skills: ["Nurse"],
                        constraint_weight: "hard",
                    },
                    {
                        constraint_name: total_weekends_in_four_weeks,
                        max_constraint_value: "5.0",
                        max_constraint_weight: "hard",
                        min_constraint_value: "1.0",
                        min_constraint_weight: "5.0",
                    },
                    {
                        constraint_name: min_max_num_assignments_in_four_weeks,
                        max_constraint_value: "5.0",
                        max_constraint_weight: "hard",
                        min_constraint_value: "1.0",
                        min_constraint_weight: "5.0",
                    },
                    {
                        constraint_name: min_max_consecutive_weekends,
                        max_constraint_value: "5.0",
                        max_constraint_weight: "hard",
                        min_constraint_value: "1.0",
                        min_constraint_weight: "5.0",
                    },
                    {
                        constraint_name: min_max_consecutive_shift_type,
                        max_constraint_value: "5.0",
                        max_constraint_weight: "hard",
                        min_constraint_value: "1.0",
                        min_constraint_weight: "5.0",
                        shift_constraint: "Early",
                    },
                    {
                        constraint_name: identical_shift_during_weekend,
                        constraint_weight: "hard",
                    },
                    {
                        constraint_name: complete_weekends,
                        constraint_weight: "hard",
                    },
                    {
                        constraint_name: unwanted_pattern,
                        unwanted_pattern_elements: [
                            {
                                pattern_element_shift: [
                                    "Late",
                                    "Early",
                                    "MidDay",
                                ],
                                pattern_element_day: [
                                    "Monday",
                                    "Wednesday",
                                    "Friday",
                                ],
                            },
                            {
                                pattern_element_shift: ["Early"],
                                pattern_element_day: ["Tuesday"],
                            },
                        ],
                        constraint_weight: "hard",
                    },
                    {
                        constraint_name: alternative_shift,
                        shift_constraint: "Early",
                        constraint_weight: "hard",
                    },
                ],
                profile: profile1,
            },
            {
                contract_name: "contract 2",
                contract_constraints: [],
                profile: profile1,
            },
            {
                contract_name: "contract 3",
                contract_constraints: [],
                profile: profile1,
            },
        ]
        self.expected_shifts = [early_shift, late_shift]
        self.expected_shift_types = [day_shift_type, night_shift_type]
        self.expected_shift_groups = [work_shift_group, rest_shift_group]
        self.expected_skills = [
            nurse_skill,
            head_nurse_skill,
            sociologist_skill,
        ]
        self.expected_profile = {
            profile_name: profile1,
            profile_contracts: self.expected_contracts,
            profile_shifts: self.expected_shifts,
            profile_contract_groups: [],
            profile_shift_types: self.expected_shift_types,
            profile_shift_groups: self.expected_shift_groups,
            profile_nurses: [],
            profile_nurse_groups: [],
            profile_skills: self.expected_skills,
        }

    def tearDown(self) -> None:
        self.tearDownPyfakefs()

    def test_contracts_creation(self):
        contracts_string = """name,FullTime,,,,,,,,
#constraint name ,,,,,,,,,
#,shift,value,weight,,,,,,
number of free days after shift,Early,1.0,hard
,,,,,,
#,skills,weight,,,,,,,
unwanted skills,Nurse,hard,,,,,,,
#,value,weight,,,,,,,
total number of working weekends in four weeks,1.0,5.0,5.0,hard,,,,,,,
#,min value,min weight,max value,max weight
,,,,,
minimum and maximum number of assignments in four weeks,1.0,5.0,5.0,hard,,,,,
#,min value,min weight,max value,max weight,,,,,
minimum and maximum of consecutive working weekends,1.0,5.0,5.0,hard,,,,,
#,shift,min value,min weight,max value,max weight,,,,
minimum and maximum of consecutive shift type,Early,1.0,5.0,5.0,hard,,,,
#,weight,,,,,,,,
identical shift types during weekend,hard,,,,,,,,
#,weight,,,,,,,,
complete weekends,hard,,,,,,,,
#,days,,,,,,,shift,weight
Unwanted patterns,Monday|Wednesday|Friday,Late|Early|MidDay,Tuesday,Early,hard
#,shift,weight,,,,,,,
unwanted shift,Early,hard,,,,,,,
,,,,,,,,,
name,contract 2,,,,,,,,
name,contract 3,,,,,,,,"""
        profile_name = profile1
        contracts = CSVImporter.read_contracts(profile_name, contracts_string)
        output_json = []
        for contract in contracts:
            output_json.append(contract.to_json())

        self.assertEqual(self.expected_contracts, output_json)

    def test_create_contracts_empty_string_return_empty(self):
        string = ""
        profile_name_test = profile1
        expected_output = []
        contracts = CSVImporter.read_contracts(profile_name_test, string)
        output_json = []
        for contract in contracts:
            output_json.append(contract.to_json())
        self.assertEqual(expected_output, output_json)

    def test_shifts_creation(self):
        profile_name_test = profile1
        string = """Early,08:00:00,16:00:00,,,,,,,
Late,18:00:00,24:00:00,,,,,,,"""
        shifts = CSVImporter.create_shifts(string, profile_name_test)
        shifts_json = []
        for shift in shifts:
            shifts_json.append(shift.to_json())

        self.assertEqual(self.expected_shifts, shifts_json)

    def test_shift_types_creation(self):
        profile_name_test = profile1
        string = """#shift type name ,Shifts,,,,,,,,
Day,Early,,,,,,,,
Night,Late,,,,,,,,"""
        shift_types = CSVImporter.create_shift_types(string, profile_name_test)
        json = []
        for st in shift_types:
            json.append(st.to_json())

        self.assertEqual(self.expected_shift_types, json)

    def test_shift_groups_creation(self):
        profile_name_test = profile1
        string = """Work,,,,
Rest,,,,"""
        shift_groups = CSVImporter.create_shift_groups(
            string, profile_name_test, []
        )
        json = []
        for sg in shift_groups:
            json.append(sg.to_json())

        self.assertEqual(self.expected_shift_groups, json)

    def test_skills_creation(self):
        profile_name_test = profile1
        string = """Nurse,HeadNurse
Sociologist"""
        skills = CSVImporter.create_skills(string, profile_name_test)
        json = []
        for skill in skills:
            json.append(skill.to_json())

        self.assertEqual(self.expected_skills, json)

    @patchfs
    def test_detailed_contract_creation(self, mockfs):
        text = """profile,,,,,,,,,
name,profile1,,,,,,,,
shifts,,,,,,,,,
Early,08:00:00,16:00:00,,,,,,,
Late,18:00:00,24:00:00,,,,,,,
shift types,,,,,,,,,
#shift type name ,Shifts,,,,,,,,
Day,Early,,,,,,,,
Night,Late,,,,,,,,
shift groups
Work,,,,
Rest,,,,
contracts,,,,,,,,,
name,FullTime,,,,,,,,
#constraint name ,,,,,,,,,
#,shift,value,weight,,,,,,
number of free days after shift,Early,1.0,hard
,,,,,,
#,skills,weight,,,,,,,
unwanted skills,Nurse,hard,,,,,,,
#,value,weight,,,,,,,
total number of working weekends in four weeks,1.0,5.0,5.0,hard,,,,,,,
#,min value,min weight,max value,max weight
,,,,,
minimum and maximum number of assignments in four weeks,1.0,5.0,5.0,hard,,,,,
#,min value,min weight,max value,max weight,,,,,
minimum and maximum of consecutive working weekends,1.0,5.0,5.0,hard,,,,,
#,shift,min value,min weight,max value,max weight,,,,
minimum and maximum of consecutive shift type,Early,1.0,5.0,5.0,hard,,,,
#,weight,,,,,,,,
identical shift types during weekend,hard,,,,,,,,
#,weight,,,,,,,,
complete weekends,hard,,,,,,,,
#,days,,,,,,,shift,weight
Unwanted patterns,Monday|Wednesday|Friday,Late|Early|MidDay,Tuesday,Early,hard
#,shift,weight,,,,,,,
unwanted shift,Early,hard,,,,,,,
,,,,,,,,,
name,contract 2,,,,,,,,
name,contract 3,,,,,,,,
skills,,,,,,,,,
Nurse,HeadNurse
Sociologist"""
        file_name = "import.txt"
        mockfs.create_file(file_name, contents=text)
        actual_profile = CSVImporter().read_file(file_name)
        self.assertEqual(actual_profile, self.expected_profile)
