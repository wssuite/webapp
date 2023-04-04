from src.dao.nurse_dao import NurseDao, Nurse
from unittest import TestCase
from src.dao.abstract_dao import connect_to_fake_db
from constants import (
    nurse_name,
    nurse_contracts,
    nurse_id,
    nurse_username,
    profile,
    nurse_contract_groups,
)
from src.exceptions.nurse_exceptions import NurseUsernameAlreadyExist
from test_constants import profile1, profile2, nurse_with_contract_group


def create_nurse_dao():
    dao = NurseDao(connect_to_fake_db())
    return dao


class TestNurseDao(TestCase):
    def setUp(self) -> None:
        self.nurse_dict = {
            nurse_name: "random",
            nurse_contracts: ["FullTime"],
            nurse_username: "random",
            profile: profile1,
            nurse_contract_groups: [],
        }
        self.nurse_invalid = {
            nurse_name: "ransom",
            nurse_username: "random",
            nurse_contracts: ["FullTime"],
            profile: profile1,
            nurse_contract_groups: [],
        }
        self.nurse_update = {
            nurse_name: "random",
            nurse_contracts: ["FullTime", "random contract"],
            nurse_username: "random",
            profile: profile1,
            nurse_contract_groups: [],
        }
        self.dao = create_nurse_dao()

    def tearDown(self) -> None:
        pass

    def test_insert_nurse_when_not_exist_succeed(self):
        nurse = Nurse().from_json(self.nurse_dict)
        id_nurse = self.dao.insert_one(nurse.db_json())
        nurse_dict = self.nurse_dict.copy()
        nurse_dict[nurse_id] = id_nurse
        all_nurses = self.dao.fetch_all(profile1)
        self.assertEqual(1, len(all_nurses))
        self.assertEqual(nurse_dict, all_nurses[0])

    def test_insert_nurse_when_username_exist_raise_exception(self):
        nurse1 = Nurse().from_json(self.nurse_dict)
        nurse2 = Nurse().from_json(self.nurse_invalid)
        self.dao.insert_one(nurse1.db_json())
        with self.assertRaises(NurseUsernameAlreadyExist):
            self.dao.insert_one(nurse2.db_json())

    def test_get_nurses_with_contracts(self):
        nurse = Nurse().from_json(self.nurse_dict)
        inserted_id = self.dao.insert_one(nurse.db_json())
        nurse_dict = self.nurse_dict.copy()
        nurse_dict[nurse_id] = inserted_id
        part_time = self.dao.get_with_contracts(["ParTime"], profile1)
        full_time = self.dao.get_with_contracts(["FullTime"], profile1)
        self.assertEqual(0, len(part_time))
        self.assertEqual(1, len(full_time))
        self.assertEqual(nurse_dict, full_time[0])

    def test_update_nurse(self):
        nurse = Nurse().from_json(self.nurse_dict)
        inserted_id = self.dao.insert_one(nurse.db_json())
        self.dao.update(self.nurse_update)
        result = self.nurse_update.copy()
        result[nurse_id] = inserted_id
        nurse_updated = self.dao.find_by_username(
            self.nurse_dict[nurse_username], self.nurse_dict[profile]
        )
        self.assertEqual(result, nurse_updated)

    def test_remove_nurse(self):
        nurse = Nurse().from_json(self.nurse_dict)
        self.dao.insert_one(nurse.db_json())
        all_nurses_before = self.dao.fetch_all(profile1)
        self.dao.remove(nurse.username, nurse.profile)
        all_nurses_after = self.dao.fetch_all(profile1)
        self.assertEqual(1, len(all_nurses_before))
        self.assertEqual(0, len(all_nurses_after))

    def test_delete_all_nurses_from_profile_deletes_items_for_specific_profile(
        self,
    ):
        nurse = Nurse().from_json(self.nurse_dict)
        self.dao.insert_one(nurse.db_json())
        profile1_before = self.dao.fetch_all(profile1)
        self.dao.duplicate(profile1, profile2)
        self.dao.delete_all(profile1)
        profile1_after = self.dao.fetch_all(profile1)
        profile2_nurses = self.dao.fetch_all(profile2)
        self.assertEqual(1, len(profile1_before))
        self.assertEqual(1, len(profile2_nurses))
        self.assertEqual(0, len(profile1_after))

    def test_get_nurses_with_contract_groups(self):
        nurse = Nurse().from_json(nurse_with_contract_group.copy())
        id_nurse = self.dao.insert_one(nurse.db_json())
        actual_nurse_with_contract_group = self.dao.get_with_contract_groups(
            ["contract_group_without_contradiction"], profile1
        )
        expected = nurse_with_contract_group.copy()
        expected[nurse_id] = id_nurse
        self.assertEqual(1, len(actual_nurse_with_contract_group))
        self.assertEqual(expected, actual_nurse_with_contract_group[0])
