from src.dao.shift_dao import Shift
from src.dao.shift_group_dao import ShiftGroupDao
from src.handlers.base_handler import BaseHandler
from src.exceptions.shift_exceptions import CannotDeleteShift, ShiftNotExist
from constants import (
    shift_name,
    work,
    contract_name,
    shift_type_name,
    shift_group_name,
)


def add_shift_in_work_shift_group(
    name, shift_group_dao: ShiftGroupDao, profile
):
    shift_group_dao.add_shift_to_shift_group_list(work, name, profile)


def remove_shift_from_work_shift_group(
    name, shift_group_dao: ShiftGroupDao, profile
):
    shift_group_dao.delete_shift_from_shift_group_list(work, name, profile)


class ShiftHandler(BaseHandler):
    def __init__(self, mongo):
        super().__init__(mongo)

    def add(self, token, json):
        super().add(token, json)
        shift = Shift().from_json(json)
        self.verify_name_is_valid(shift.name)
        self.shift_dao.insert_one_if_not_exist(shift.db_json())
        add_shift_in_work_shift_group(
            shift.name, self.shift_group_dao, shift.profile
        )

    def update(self, token, json):
        super().update(token, json)
        shift = Shift().from_json(json)
        self.shift_dao.update(shift.db_json())

    def delete(self, token, name, profile):
        super().delete(token, name, profile)
        contracts_usage = [
                contract[contract_name]
                for contract in self.contract_dao.get_including_shifts(
                    [name], profile
                )
        ]
        shift_types_usage = [
                shift_type[shift_type_name]
                for shift_type in self.shift_type_dao.get_including_shifts(
                    [name], profile
                )
            ]
        shift_groups_usage = [
                shift_group[shift_group_name]
                for shift_group in self.shift_group_dao.get_including_shifts(
                    [name], profile
                )
        ]
        if len(shift_groups_usage) > 1:
            raise CannotDeleteShift(name, contracts_usage, shift_types_usage, shift_groups_usage)
        if len(contracts_usage) > 0 or len(shift_types_usage) > 0:
            raise CannotDeleteShift(name, contracts_usage, shift_types_usage, shift_groups_usage)

        self.shift_dao.remove(name, profile)
        remove_shift_from_work_shift_group(name, self.shift_group_dao, profile)

    def get_by_name(self, token, name, profile):
        super().get_by_name(token, name, profile)
        shift_dict = self.shift_dao.find_by_name(name, profile)
        if shift_dict is None:
            raise ShiftNotExist(name)
        return Shift().from_json(shift_dict).to_json()

    def get_all(self, token, profile):
        super().get_all(token, profile)
        return self.shift_dao.fetch_all(profile)

    def get_all_names(self, token, profile):
        return [shift[shift_name] for shift in self.get_all(token, profile)]
