from src.example.Scenario import Scenario
from src.example.Personnel import Personnel
from unittest import TestCase


class TestScenario(TestCase):
    def setUp(self) -> None:
        self.scenario_data = {
            "scenario_name": "n005w4",
            "staff": [{"name": "random", "contract_type": "random"}],
            "constraints": ["Early 0"],
        }
        self.scenario = Scenario()
        self.scenario.scenario_name = "n005w4"
        self.personnel = Personnel()
        self.personnel.name = "random"
        self.personnel.contract_type = "random"
        self.scenario.staff = [self.personnel]
        self.scenario.constraints = ["Early 0"]

    def test_scenario_creation(self):
        scenario = Scenario().from_json(self.scenario_data)
        self.assertEqual(str(scenario.staff), str(self.scenario.staff))
        self.assertEqual(scenario.constraints, self.scenario.constraints)
        self.assertEqual(scenario.scenario_name, self.scenario.scenario_name)

    def test_scenario_to_string(self):
        scenario_str = (
            "Scenario name = n005w4 \n\n"
            "Staff\nrandom random\n \n \n"
            "Constraints\nEarly 0\n"
        )
        self.assertEqual(scenario_str, str(self.scenario))
