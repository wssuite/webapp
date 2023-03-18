from unittest.mock import patch

from src.handlers.schedule_handler import ScheduleHandler
from src.dao.abstract_dao import connect_to_fake_db
from constants import (
    start_date,
    end_date,
    schedule_hospital_demand,
    profile,
    schedule_pref,
    demand_date,
    demand_shift,
    demand_max_value,
    demand_max_weight,
    demand_min_weight,
    demand_min_value,
    demand_skill,
    preference_date,
    preference_weight,
    preference_shift,
    preference_username,
    preference_pref,
    schedule_nurses,
    schedule_skills,
    schedule_shifts,
)
from test.db_test_constants import build_db, random_hex
from pyfakefs.fake_filesystem_unittest import TestCase

hospital_demand_dict = {
    start_date: "2023-06-01",
    end_date: "2023-06-02",
    profile: "profile1",
    schedule_hospital_demand: [
        {
            demand_date: "2023-06-01",
            demand_shift: "Late",
            demand_skill: "Nurse",
            demand_min_value: "1.0",
            demand_min_weight: "hard",
            demand_max_value: "10.0",
            demand_max_weight: "5.0",
        }
    ],
    schedule_pref: [
        {
            preference_date: "2023-06-01",
            preference_username: "eve",
            preference_pref: "ON",
            preference_shift: "Early",
            preference_weight: "5.0",
        }
    ],
    schedule_nurses: [
        "patrick",
        "eve",
        "nurse2",
        "nurse3",
        "head nurse 2",
        "head nurse 3",
    ],
    schedule_skills: ["Nurse", "HeadNurse"],
    schedule_shifts: ["Early", "MidDay", "Late"],
}

expected = """HEADERS
(0,patrick)
(3,eve)
(1,nurse2)
(2,nurse3)
(4,head nurse 2)
(5,head nurse 3)
END
SCHEDULING_PERIOD
profile1,3.0,2023-06-01,2023-06-02
END
SKILLS
Nurse
HeadNurse
END
SHIFTS
Early,08:00:00,16:00:00
MidDay,12:00:00,16:00:00
Late,16:00:00,24:00:00
END
SHIFT_GROUPS
Work,3,Early,MidDay,Late,2,Day,Night
Rest,0,0
END
SHIFT_TYPES
Day,2,Early,MidDay
Night,1,Late
END
CONTRACTS
{
contractName,General
constraints
NumberOfFreeDaysAfterShift,hard,1.0,Late
MinMaxConsecutiveWeekends,1.0,5.0,3.0,hard
}
{
contractName,Nurses contracts
constraints
unwantedSkills,hard,1,HeadNurse
TotalWeekendsInFourWeeks,1.0,5.0,5.0,hard
IdentShiftTypesDuringWeekend,hard
}
{
contractName,Head nurses contracts
constraints
unwantedSkills,hard,1,Nurse
TotalWeekendsInFourWeeks,1.0,5.0,3.0,hard
IdentShiftTypesDuringWeekend,hard
}
{
contractName,patricks contract
constraints
MinMaxConsecutiveShiftType,1.0,hard,3.0,hard,Late
CompleteWeekends,5.0
AlternativeShift,hard,MidDay
unwantedPatterns,hard,2,Monday|Friday;Late,Tuesday|Saturday;Early|MidDay
}
{
contractName,eves contract
constraints
MinMaxConsecutiveShiftType,1.0,hard,3.0,hard,Late
CompleteWeekends,5.0
AlternativeShift,hard,Late
unwantedPatterns,hard,2,Monday|Friday;Late,Tuesday|Saturday;Early|MidDay
}
END
CONTRACT_GROUPS
head nurse contract group,1,Head nurses contracts
nurse contract group,1,Nurses contracts
END
EMPLOYEES
0,patrick,2,patricks contract,General,1,nurse contract group
3,eve,2,eves contract,General,1,head nurse contract group
1,nurse2,2,patricks contract,General,1,nurse contract group
2,nurse3,2,patricks contract,General,1,nurse contract group
4,head nurse 2,2,eves contract,General,1,head nurse contract group
5,head nurse 3,2,eves contract,General,1,head nurse contract group
END
HOSPITAL_DEMAND
2023-06-01,Late,Nurse,1.0,hard,10.0,5.0
END
PREFERENCES
2023-06-01,3,ON,Early,5.0
END
"""


class TestGenerateCppInputFile(TestCase):
    def setUp(self):
        self.handler = ScheduleHandler(connect_to_fake_db())
        self.setUpPyfakefs()
        build_db(self.handler)

    def tearDown(self) -> None:
        self.tearDownPyfakefs()

    @patch("random.random")
    def test_generate_schedule(self, mock_random):
        mock_random.return_value = 3.0
        self.handler.generate_schedule(random_hex, hospital_demand_dict)
        fake_file = self.fs.get_object("input.txt")
        actual = fake_file.contents
        self.assertEqual(expected, actual)
