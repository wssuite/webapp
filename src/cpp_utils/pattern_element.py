from src.cpp_utils.jsonify import Jsonify
from pykson import StringField
from constants import pattern_element_shift, \
    pattern_element_day


class PatternElement(Jsonify):
    shift = StringField(serialized_name=pattern_element_shift)
    day = StringField(serialized_name=pattern_element_day)
