from src.dao.user_dao import UserDao
from src.dao.contract_dao import ContractDao
from src.dao.shift_group_dao import ShiftGroupDao, ShiftGroup
from src.dao.shift_type_dao import ShiftTypeDao
from src.dao.shift_dao import ShiftDao
from constants import shift_group_name, work, rest
from src.exceptions.shift_exceptions import (
    ShiftNotExist,
    CannotDeleteDefaultShiftGroup,
    CannotDeleteShiftGroup,
)
from src.handlers.user_handler import verify_token


class ShiftGroupHandler:
    def __init__(self, mongo):
        self.user_dao = UserDao(mongo)
        self.shift_dao = ShiftDao(mongo)
        self.shift_type_dao = ShiftTypeDao(mongo)
        self.shift_group_dao = ShiftGroupDao(mongo)
        self.contract_dao = ContractDao(mongo)

    def verify_shifts_exist(self, shifts):
        not_exist_shifts = []
        for shift in shifts:
            exist_shift = self.shift_dao.exist(shift)
            exist_shift_type = self.shift_type_dao.exist(shift)
            if exist_shift is False and exist_shift_type is False:
                not_exist_shifts.append(shift)
        if len(not_exist_shifts) > 0:
            raise ShiftNotExist(not not_exist_shifts)

    def add(self, token, json):
        verify_token(token, self.user_dao)
        shift_group = ShiftGroup().from_json(json)
        self.verify_shifts_exist(shift_group.shifts)
        self.shift_group_dao.insert_one_if_not_exist(shift_group.db_json())

    def update(self, token, json):
        verify_token(token, self.user_dao)
        shift_group = ShiftGroup().from_json(json)
        self.verify_shifts_exist(shift_group.shifts)
        self.shift_group_dao.update(shift_group.db_json())

    def delete(self, token, name):
        verify_token(token, self.user_dao)
        if name == work or name == rest:
            raise CannotDeleteDefaultShiftGroup(name)
        usage = self.contract_dao.get_including_shifts([name])
        if len(usage) > 0:
            raise CannotDeleteShiftGroup(name)
        self.shift_group_dao.remove(name)

    def get_all(self, token):
        verify_token(token, self.user_dao)
        return self.shift_group_dao.fetch_all()

    def get_by_name(self, token, name):
        verify_token(token, self.user_dao)
        shift_group_dict = self.shift_group_dao.find_by_name(name)
        if shift_group_dict is None:
            raise ShiftNotExist(name)
        return ShiftGroup().from_json(shift_group_dict).to_json()

    def get_all_names(self, token):
        return [
            shift_group[shift_group_name]
            for shift_group in self.get_all(token)
        ]
