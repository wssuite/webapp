from src.models.jsonify import Jsonify
from pykson import StringField
from constants import (
    preference_date,
    preference_username,
    preference_shift,
    preference_weight,
    preference_pref,
)


class NursePreferenceElement(Jsonify):
    date = StringField(serialized_name=preference_date)
    username = StringField(serialized_name=preference_username)
    preference = StringField(serialized_name=preference_pref)
    shift = StringField(serialized_name=preference_shift)
    weight = StringField(serialized_name=preference_weight)
