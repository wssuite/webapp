from src.dao.shift_type_dao import ShiftType
from constants import shift_type_name, work
from src.handlers.base_handler import BaseHandler
from src.exceptions.shift_exceptions import (
    CannotDeleteShiftType,
    ShiftNotExist,
)


class ShiftTypeHandler(BaseHandler):
    def __init__(self, mongo):
        super().__init__(mongo)

    def verify_shifts_exist(self, shifts, profile):
        not_exist_shifts = []
        for shift in shifts:
            exist = self.shift_dao.exist(shift, profile)
            if exist is False:
                not_exist_shifts.append(shift)
        if len(not_exist_shifts) > 0:
            raise ShiftNotExist(not_exist_shifts)

    def __add_shift_type_to_work_shift_group(self, name, profile):
        self.shift_group_dao.add_shift_type_to_shift_group_list(work, name, profile)

    def add(self, token, json):
        super().add(token, json)
        shift_type = ShiftType().from_json(json)
        self.verify_shifts_exist(shift_type.shifts, shift_type.profile)
        self.shift_type_dao.insert_one_if_not_exist(shift_type.db_json())
        self.__add_shift_type_to_work_shift_group(shift_type.name, shift_type.profile)

    def update(self, token, json):
        super().update(token, json)
        shift_type = ShiftType().from_json(json)
        self.verify_shifts_exist(shift_type.shifts, shift_type.profile)
        self.shift_type_dao.update(shift_type.db_json())

    def __remove_shift_type_from_work_shift_group(self, name, profile_name):
        self.shift_group_dao.delete_shift_type_from_shift_group_list(work, name, profile_name)

    def delete(self, token, name, profile):
        super().delete(token, name, profile)
        usage = []
        usage.extend(self.contract_dao.get_including_shifts([name], profile))
        usage.extend(
            self.shift_group_dao.get_including_shift_types([name], profile)
        )
        if len(usage) > 1:
            raise CannotDeleteShiftType(name)
        self.shift_type_dao.remove(name, profile)
        self.__remove_shift_type_from_work_shift_group(name, profile)

    def get_by_name(self, token, name, profile):
        super().get_by_name(token, name, profile)
        shift_type_dict = self.shift_type_dao.find_by_name(name, profile)
        if shift_type_dict is None:
            raise ShiftNotExist(name)
        return ShiftType().from_json(shift_type_dict).to_json()

    def get_all(self, token, profile):
        super().get_all(token, profile)
        return self.shift_type_dao.fetch_all(profile)

    def get_all_names(self, token, profile):
        return [
            shift_type[shift_type_name]
            for shift_type in self.get_all(token, profile)
        ]
