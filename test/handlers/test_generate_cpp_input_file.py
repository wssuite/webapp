from src.handlers.schedule_haandler import ScheduleHandler
from src.dao.abstract_dao import connect_to_fake_db
from unittest import TestCase
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
)
from test.db_test_constants import build_db, random_hex

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
}


class TestGenerateCppInputFile(TestCase):
    def setUp(self):
        self.handler = ScheduleHandler(connect_to_fake_db())
        build_db(self.handler)

    def tearDown(self) -> None:
        pass

    def test_generate_schedule(self):
        self.handler.generate_schedule(random_hex, hospital_demand_dict)
