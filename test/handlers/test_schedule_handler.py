from src.exceptions.project_base_exception import ProjectBaseException
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
    version,
    state,
    previous_versions,
)
from test.db_test_constants import build_db, random_hex, profile1
from pyfakefs.fake_filesystem_unittest import TestCase
from src.utils.file_system_manager import (
    base_directory,
    dataset_directory,
)

hospital_demand_dict = {
    start_date: "2023-06-01",
    end_date: "2023-06-02",
    profile: profile1,
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


class TestScheduleHandler(TestCase):
    def setUp(self):
        self.handler = ScheduleHandler(connect_to_fake_db())
        self.setUpPyfakefs()
        path = self.fs.joinpaths(
            base_directory, dataset_directory, profile1
        )
        self.fs.create_dir(path)
        build_db(self.handler)

    def tearDown(self) -> None:
        self.tearDownPyfakefs()

    def test_get_input_file_path_if_exist_succeed(self):
        solution = self.handler.generate_schedule(
            random_hex, hospital_demand_dict
        )
        full_path = self.fs.joinpaths(
            base_directory,
            dataset_directory,
            profile1,
            "2023-06-01_2023-06-02",
            solution[version],
        )
        expected_solution = {
            start_date: "2023-06-01",
            end_date: "2023-06-02",
            profile: profile1,
            version: "1",
            state: "In Progress",
        }
        self.assertEqual(expected_solution, solution)
        folder_exist = self.fs.exists(full_path)
        self.assertTrue(folder_exist)
        actual = self.handler.get_input_problem_path(
            random_hex,
            profile1,
            "2023-06-01",
            "2023-06-02",
            solution[version],
        )
        expected_path = self.fs.joinpaths(full_path, "input.txt")
        if self.fs.is_linux is True:
            self.assertEqual(
                f"{base_directory}/{dataset_directory}/{profile1}/"
                f"2023-06-01_2023-06-02/{solution[version]}/input.txt",
                expected_path,
            )

        self.assertEqual(expected_path, actual)

    def test_get_input_file_path_if_not_exist_raise_error(self):
        with self.assertRaises(ProjectBaseException):
            self.handler.get_input_problem_path(
                random_hex, profile1, "2023-06-01", "2023-06-02", "1"
            )

    def test_regenerate_schedule(self):
        self.handler.generate_schedule(
            random_hex, hospital_demand_dict
        )
        solution = self.handler.regenerate_schedule(
            random_hex, hospital_demand_dict, "1"
        )
        expected_solution = {
            start_date: "2023-06-01",
            end_date: "2023-06-02",
            profile: profile1,
            version: "2",
            state: "In Progress",
        }
        self.assertEqual(expected_solution, solution)
        solution_detailed = self.handler.get_detailed_solution(
            random_hex, "2023-06-01", "2023-06-02", profile1, "2"
        )
        expected_detailed = expected_solution.copy()
        expected_detailed[previous_versions] = [
            {
                start_date: "2023-06-01",
                end_date: "2023-06-02",
                profile: profile1,
                version: "1",
                state: "In Progress",
            }
        ]
        self.assertEqual(expected_detailed, solution_detailed)

    def test_get_latest_solutions(self):
        self.handler.generate_schedule(
            random_hex, hospital_demand_dict
        )
        self.handler.regenerate_schedule(
            random_hex, hospital_demand_dict, "1"
        )
        actual = self.handler.get_latest_solutions_versions(
            random_hex, profile1
        )
        expected_solution = {
            start_date: "2023-06-01",
            end_date: "2023-06-02",
            profile: profile1,
            version: "2",
            state: "In Progress",
        }
        self.assertEqual([expected_solution], actual)

    def test_get_all_solutions(self):
        self.handler.generate_schedule(
            random_hex, hospital_demand_dict
        )
        self.handler.regenerate_schedule(
            random_hex, hospital_demand_dict, "1"
        )
        actual = self.handler.get_all_solutions(random_hex, profile1)
        expected_solution = [
            {
                start_date: "2023-06-01",
                end_date: "2023-06-02",
                profile: profile1,
                version: "1",
                state: "In Progress",
            },
            {
                start_date: "2023-06-01",
                end_date: "2023-06-02",
                profile: profile1,
                version: "2",
                state: "In Progress",
            },
        ]
        self.assertEqual(expected_solution, actual)
