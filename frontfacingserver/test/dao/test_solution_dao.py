from constants import (
    start_date,
    profile,
    end_date,
    version,
    worker_host,
    previous_versions,
    state,
    timestamp,
)
from src.dao.abstract_dao import connect_to_fake_db
from src.dao.solution_dao import SolutionDao
from unittest import TestCase

from test_constants import solution1, solution2, profile1


class TestSolutionDao(TestCase):
    def setUp(self) -> None:
        self.solution1 = solution1
        self.solution2 = solution2
        self.dao = SolutionDao(connect_to_fake_db())

    def tearDown(self) -> None:
        pass

    def test_insert_a_solution_succeeds(self):
        self.dao.insert_one(self.solution1.copy())
        all_solution = self.dao.fetch_all(profile1)
        self.assertEqual(1, len(all_solution))
        solution = self.dao.get_solution(
            solution1[start_date],
            solution1[end_date],
            solution1[profile],
            solution1[version],
        )
        solution.pop(timestamp)
        self.assertEqual(self.solution1, solution)

    def test_get_latest_version(self):
        self.dao.insert_one(self.solution1.copy())
        latest_before = self.dao.get_latest_versions(profile1)
        expected_before = self.solution1.copy()
        expected_before.pop(worker_host)
        expected_before.pop(previous_versions)
        self.assertEqual(1, len(latest_before))
        before = latest_before[0]
        before.pop(timestamp)
        self.assertEqual(expected_before, before)
        self.dao.insert_one(self.solution2.copy())
        latest_after = self.dao.get_latest_versions(profile1)
        expected_after = self.solution2.copy()
        expected_after.pop(worker_host)
        expected_after.pop(previous_versions)
        after = latest_after[0]
        after.pop(timestamp)
        self.assertEqual(1, len(latest_before))
        self.assertEqual(expected_after, after)

    def test_delete_all(self):
        self.dao.insert_one(self.solution1.copy())
        self.dao.insert_one(self.solution2.copy())
        before_delete = self.dao.fetch_all(profile1)
        self.assertEqual(2, len(before_delete))
        self.dao.delete_all(profile1)
        after_delete = self.dao.fetch_all(profile1)
        self.assertEqual(0, len(after_delete))

    def test_update_state(self):
        self.dao.insert_one(self.solution1.copy())
        solution = self.dao.get_solution(
            solution1[start_date],
            solution1[end_date],
            solution1[profile],
            solution1[version],
        )
        timestamp_before = solution.pop(timestamp)
        self.assertEqual(solution1, solution)
        self.dao.update_state(
            solution1[start_date],
            solution1[end_date],
            solution1[profile],
            solution1[version],
            "Success",
        )
        expected_after = self.solution1.copy()
        expected_after[state] = "Success"
        actual_after = self.dao.get_solution(
            solution1[start_date],
            solution1[end_date],
            solution1[profile],
            solution1[version],
        )
        timestamp_after = actual_after.pop(timestamp)
        self.assertEqual(expected_after, actual_after)
        self.assertEqual(timestamp_before, timestamp_after)

    def test_remove_a_solution_succeeds(self):
        self.dao.insert_one(self.solution1.copy())
        solution = self.dao.collection.find_one(
            {
                start_date: self.solution1[start_date],
                end_date: self.solution1[end_date],
                profile: self.solution1[profile],
                version: self.solution1[version],
            }
        )
        self.assertNotEqual(None, solution)
        self.dao.remove(
            self.solution1[start_date],
            self.solution1[end_date],
            self.solution1[profile],
            self.solution1[version],
        )
        after = self.dao.collection.find_one(
            {
                start_date: self.solution1[start_date],
                end_date: self.solution1[end_date],
                profile: self.solution1[profile],
                version: self.solution1[version],
            }
        )
        self.assertEqual(None, after)
