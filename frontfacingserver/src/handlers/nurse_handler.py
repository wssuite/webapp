from src.dao.nurse_dao import Nurse
from src.handlers.base_handler import BaseHandler
from src.exceptions.nurse_exceptions import NurseNotFound, CannotDeleteNurse
from constants import (
    nurse_username,
    nurse_id,
    nurse_group_name,
)


class NurseHandler(BaseHandler):
    def __init__(self, mongo):
        super().__init__(mongo)

    """
    Before adding a nurse we need to verify:
    1- Contracts of the nurse exist
    2- The contracts combination doesn't cause a problem
    """

    def add(self, token, json):
        super().add(token, json)
        nurse = Nurse().from_json(json)
        self.nurse_insertion_validations(nurse)
        inserted_id = self.nurse_dao.insert_one(nurse.db_json())
        return inserted_id

    """
    Before updating a nurse we need to verify:
    1- Contracts according to the update exist
    2- The new contract combination doesn't cause a problem
    3- The combination of new contracts work well with the
    nurse's groups contracts
    """

    def update(self, token, json):
        super().update(token, json)
        nurse = Nurse().from_json(json)
        self.nurse_insertion_validations(nurse)
        before_update = self.get_by_username(
            token, nurse.username, nurse.profile
        )
        nurse.id = before_update[nurse_id]
        self.nurse_dao.update(nurse.db_json())

    """
    Get the details of a nurse by username:
    Add the contracts that exist in the nurse groups
    to the list of inherited contracts
    """

    def get_by_username(self, token, nurse_to_be_found_username, profile):
        self.verify_token(token)
        nurse_dict = self.nurse_dao.find_by_username(
            nurse_to_be_found_username, profile
        )
        if nurse_dict is None:
            raise NurseNotFound(nurse_to_be_found_username)
        nurse = Nurse().from_json(nurse_dict)
        return nurse.to_json()

    def get_all(self, token, profile):
        super().get_all(token, profile)
        all_nurses = self.nurse_dao.fetch_all(profile)
        return all_nurses

    def get_all_usernames(self, token, profile):
        self.verify_token(token)
        all_nurses = self.nurse_dao.fetch_all(profile)
        return [nurse[nurse_username] for nurse in all_nurses]

    def delete(self, token, name, profile):
        super().delete(token, name, profile)
        usage = [
            nurse_group[nurse_group_name]
            for nurse_group in self.nurse_group_dao.get_with_nurses(
                [name], profile
            )
        ]
        if len(usage) > 0:
            raise CannotDeleteNurse(name, usage)
        self.nurse_dao.remove(name, profile)
