from src.models.db_document import DBDocument
from src.models.jsonify import Jsonify
from pykson import ListField, StringField
from constants import (
    nurse_group_name,
    nurse_group_nurses_list,
    nurse_group_contracts_list,
)


class NurseGroup(Jsonify, DBDocument):
    name = StringField(serialized_name=nurse_group_name)
    nurses = ListField(str, serialized_name=nurse_group_nurses_list)
    contracts = ListField(str, serialized_name=nurse_group_contracts_list)

    def db_json(self):
        return self.to_json()
