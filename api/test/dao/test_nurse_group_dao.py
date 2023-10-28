from src.dao.nurse_group_dao import (
    NurseGroup,
    NurseGroupDao,
    NurseGroupAlreadyExist,
)
from unittest import TestCase
from src.dao.abstract_dao import connect_to_fake_db
from constants import (
    nurse_group_name,
    nurse_group_contracts_list,
    nurse_group_nurses_list,
    profile,
    nurse_group_contract_groups,
)
from test_constants import profile1, profile2, nurse_group_with_contract_groups


def create_nurse_group_dao():
    dao = NurseGroupDao(connect_to_fake_db())
    return dao


class TestNurseDao(TestCase):
    def setUp(self) -> None:
        self.nurse_group_dict = {
            nurse_group_name: "random",
            nurse_group_contracts_list: ["FullTime"],
            nurse_group_nurses_list: ["Patrick"],
            profile: profile1,
            nurse_group_contract_groups: [],
        }
        self.nurse_group_update = {
            nurse_group_name: "random",
            nurse_group_contracts_list: ["FullTime", "random contract"],
            nurse_group_nurses_list: ["Eve"],
            profile: profile1,
            nurse_group_contract_groups: [],
        }
        self.dao = create_nurse_group_dao()

    def tearDown(self) -> None:
        pass

    def test_insert_nurse_group_when_not_exist_succeed(self):
        group = NurseGroup().from_json(self.nurse_group_dict)
        self.dao.insert_one_if_not_exist(group.db_json())
        nurse_group_dict = self.nurse_group_dict.copy()
        all_nurses_groups = self.dao.fetch_all(profile1)
        self.assertEqual(1, len(all_nurses_groups))
        self.assertEqual(nurse_group_dict, all_nurses_groups[0])

    def test_insert_nurse_group_when_exist_raise_exception(self):
        nurse_group = NurseGroup().from_json(self.nurse_group_dict)
        self.dao.insert_one_if_not_exist(nurse_group.db_json())
        with self.assertRaises(NurseGroupAlreadyExist):
            self.dao.insert_one_if_not_exist(nurse_group.db_json())

    def test_get_nurse_groups_with_contracts(self):
        nurse_group = NurseGroup().from_json(self.nurse_group_dict)
        self.dao.insert_one_if_not_exist(nurse_group.db_json())
        nurse_group_dict = self.nurse_group_dict.copy()
        part_time = self.dao.get_with_contracts(["ParTime"], profile1)
        full_time = self.dao.get_with_contracts(["FullTime"], profile1)
        self.assertEqual(0, len(part_time))
        self.assertEqual(1, len(full_time))
        self.assertEqual(nurse_group_dict, full_time[0])

    def test_get_nurse_groups_with_nurses(self):
        nurse_group = NurseGroup().from_json(self.nurse_group_dict)
        self.dao.insert_one_if_not_exist(nurse_group.db_json())
        nurse_group_dict = self.nurse_group_dict.copy()
        eves_groups = self.dao.get_with_nurses(["Eve"], profile1)
        patricks_groups = self.dao.get_with_nurses(["Patrick"], profile1)
        self.assertEqual(0, len(eves_groups))
        self.assertEqual(1, len(patricks_groups))
        self.assertEqual(nurse_group_dict, patricks_groups[0])

    def test_update_nurse_group(self):
        nurse_group = NurseGroup().from_json(self.nurse_group_dict)
        self.dao.insert_one_if_not_exist(nurse_group.db_json())
        self.dao.update(self.nurse_group_update)
        result = self.nurse_group_update.copy()
        nurse_updated = self.dao.find_by_name(
            self.nurse_group_dict[nurse_group_name],
            self.nurse_group_dict[profile],
        )
        self.assertEqual(result, nurse_updated)

    def test_remove_nurse_group(self):
        nurse_group = NurseGroup().from_json(self.nurse_group_dict)
        self.dao.insert_one_if_not_exist(nurse_group.db_json())
        all_nurse_groups_before = self.dao.fetch_all(profile1)
        self.dao.remove(nurse_group.name, profile1)
        all_nurse_groups_after = self.dao.fetch_all(profile1)
        self.assertEqual(1, len(all_nurse_groups_before))
        self.assertEqual(0, len(all_nurse_groups_after))

    def test_delete_all_nurses_from_profile_deletes_items_for_specific_profile(
        self,
    ):
        nurse_group = NurseGroup().from_json(self.nurse_group_dict)
        self.dao.insert_one_if_not_exist(nurse_group.db_json())
        profile1_nurse_groups_before = self.dao.fetch_all(profile1)
        self.dao.duplicate(profile1, profile2)
        self.dao.delete_all(profile1)
        profile1_nurse_groups_after = self.dao.fetch_all(profile1)
        profile2_nurse_groups = self.dao.fetch_all(profile2)
        self.assertEqual(1, len(profile1_nurse_groups_before))
        self.assertEqual(1, len(profile2_nurse_groups))
        self.assertEqual(0, len(profile1_nurse_groups_after))

    def test_get_nurse_group_with_contract_groups(self):
        nurse_group = NurseGroup().from_json(
            nurse_group_with_contract_groups.copy()
        )
        self.dao.insert_one_if_not_exist(nurse_group.db_json())
        actual_nurse_groups = self.dao.get_with_contract_groups(
            ["contract_group_without_contradiction"], profile1
        )
        self.assertEqual(1, len(actual_nurse_groups))
        self.assertEqual(
            nurse_group_with_contract_groups, actual_nurse_groups[0]
        )
