from src.dao.shift_type_dao import ShiftType
from constants import shift_type_name
from src.handlers.base_handler import BaseHandler
from src.exceptions.shift_exceptions import (
    CannotDeleteShiftType,
    ShiftNotExist,
)
from src.handlers.shift_handler import (
    add_shift_in_work_shift_group,
    remove_shift_from_work_shift_group,
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

    def add(self, token, json):
        super().add(token, json)
        shift_type = ShiftType().from_json(json)
        self.verify_shifts_exist(shift_type.shifts, shift_type.profile)
        self.shift_type_dao.insert_one_if_not_exist(shift_type.db_json())
        add_shift_in_work_shift_group(
            shift_type.name, self.shift_group_dao, shift_type.profile
        )

    def update(self, token, json):
        super().update(token, json)
        shift_type = ShiftType().from_json(json)
        self.verify_shifts_exist(shift_type.shifts, shift_type.profile)
        self.shift_type_dao.update(shift_type.db_json())

    def delete(self, token, name, profile):
        super().delete(token, name, profile)
        usage = []
        usage.extend(self.contract_dao.get_including_shifts([name], profile))
        usage.extend(
            self.shift_group_dao.get_including_shifts([name], profile)
        )
        if len(usage) > 1:
            raise CannotDeleteShiftType(name)
        self.shift_type_dao.remove(name, profile)
        remove_shift_from_work_shift_group(name, self.shift_group_dao, profile)

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
