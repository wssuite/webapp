from unittest import TestCase
from constants import timestamp
from constants import previous_versions, worker_host
from src.models.solution import Solution
from test_constants import solution1


class TestSolution(TestCase):

    def setUp(self) -> None:
        self.solution_dict = solution1.copy()

    def tearDown(self) -> None:
        pass

    def test_solution_creation_from_json(self):
        solution = Solution().from_json(self.solution_dict)
        self.solution_dict[timestamp] = solution.timestamp
        self.assertEqual(self.solution_dict, solution.db_json())
        solution_json = self.solution_dict.copy()
        solution_json.pop(previous_versions)
        solution_json.pop(worker_host)
        self.assertEqual(solution_json, solution.to_json())
