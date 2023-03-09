from src.dao.shift_dao import ShiftDao
from unittest import TestCase
from src.dao.abstract_dao import connect_to_fake_db
from constants import shift_name, shift_start_time, shift_end_time, profile
from src.exceptions.shift_exceptions import ShiftAlreadyExistException
from test_constants import profile1


class TestShiftDao(TestCase):
    def setUp(self) -> None:
        self.dao = ShiftDao(connect_to_fake_db())
        self.shift = {
            shift_name: "Early",
            shift_start_time: "06:30:00",
            shift_end_time: "12:00:00",
            profile: profile1,
        }
        self.shift_update = {
            shift_name: "Early",
            shift_start_time: "06:00:00",
            shift_end_time: "12:00:00",
            profile: profile1,
        }

    def tearDown(self) -> None:
        pass

    def test_insert_shift_when_not_exist_succeeds(self):
        self.dao.insert_one_if_not_exist(self.shift.copy())
        all_shifts = self.dao.fetch_all()
        self.assertEqual(1, len(all_shifts))
        self.assertEqual(self.shift, all_shifts[0])

    def test_insert_shift_when_exist_raises_exception(self):
        self.dao.insert_one_if_not_exist(self.shift.copy())
        with self.assertRaises(ShiftAlreadyExistException):
            self.dao.insert_one_if_not_exist(self.shift.copy())

    def test_remove_shift(self):
        self.dao.insert_one_if_not_exist(self.shift.copy())
        shift_len_before = len(self.dao.fetch_all())
        self.dao.remove(self.shift[shift_name])
        shift_len_after = len(self.dao.fetch_all())
        self.assertEqual(0, shift_len_after)
        self.assertEqual(1, shift_len_before)

    def test_update_shift(self):
        self.dao.insert_one_if_not_exist(self.shift.copy())
        self.dao.update(self.shift_update)
        shift = self.dao.find_by_name(self.shift[shift_name])
        self.assertEqual(self.shift_update, shift)
