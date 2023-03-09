from src.models.jsonify import Jsonify
from pykson import StringField, ListField
from constants import (
    nurse_name,
    nurse_id,
    nurse_direct_contracts,
    nurse_username,
    admin,
    nurse_inherited_contracts, profile
)

from src.models.db_document import DBDocument


class Nurse(Jsonify, DBDocument):
    name = StringField(serialized_name=nurse_name, default_value=admin)
    direct_contracts = ListField(str, serialized_name=nurse_direct_contracts)
    id = StringField(serialized_name=nurse_id)
    username = StringField(serialized_name=nurse_username, default_value=admin)
    inherited_contracts = ListField(
        str, serialized_name=nurse_inherited_contracts
    )
    profile = StringField(serialized_name=profile, default_value="")

    def db_json(self):
        return {
            nurse_name: self.name,
            nurse_username: self.username,
            nurse_direct_contracts: self.direct_contracts,
            nurse_id: self.id,
            profile: self.profile
        }
