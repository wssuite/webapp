from src.models.jsonify import Jsonify
from pykson import StringField
from constants import (
    preference_date,
    preference_username,
    preference_shift,
    preference_weight,
    preference_pref,
    history_date,
    history_username,
    history_shift,
)
from src.models.stringify import Stringify


class NursePreferenceElement(Jsonify, Stringify):
    date = StringField(serialized_name=preference_date)
    username = StringField(serialized_name=preference_username)
    id = ""
    preference = StringField(serialized_name=preference_pref)
    shift = StringField(serialized_name=preference_shift)
    weight = StringField(serialized_name=preference_weight)

    def to_string(self):
        return (
            f"{self.date},{self.id},{self.preference},"
            f"{self.shift},{self.weight}\n"
        )


class NurseHistoryElement(Jsonify, Stringify):
    date = StringField(serialized_name=history_date)
    username = StringField(serialized_name=history_username)
    id = ""
    shift = StringField(serialized_name=history_shift)

    def to_string(self):
        return (
            f"{self.date},{self.id},{self.shift}\n"
        )
