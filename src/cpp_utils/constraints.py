from src.cpp_utils.stringify import Stringify
from pykson import StringField, ObjectListField
from constants import constraint_name, \
    integer_constraint_value, constraint_weight, \
    shift_constraint, min_constraint_value, \
    max_constraint_value, min_constraint_weight, \
    max_constraint_weight, unwanted_pattern_elements
from src.cpp_utils.pattern_element import PatternElement
from src.cpp_utils.jsonify import Jsonify

"""
Note: The following constraints are conceptually
following the following inheritance tree:
ContractConstraint inherit from BaseConstraint
ContractIntegerConstraint inherit from ContractConstraint
ContractIntegerShiftConstraint inherit from ContractIntegerConstraint
ContractMinMaxConstraint inherit from ContractConstraint
ContractMinMaxShiftConstraint inherit from ContractMinMaxConstraint
ContractBooleanConstraint inherit from ContractConstraint
ContractUnwantedPatterns inherit from ContractConstraint.

However, there is a limitation within the Pykson library
the inheritance is only limited to two levels it can't extend to
a third level which makes it impossible to exploit. This is the
reason the attribute name for example doesn't exist in BaseConstraint
nor in the BaseConstraint class
"""


class BaseConstraint(Jsonify, Stringify):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


class ContractConstraint(BaseConstraint):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def repr(self):
        pass


class ContractIntegerConstraint(ContractConstraint):
    name = StringField(serialized_name=constraint_name)
    value = StringField(serialized_name=integer_constraint_value)
    weight = StringField(serialized_name=constraint_weight)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def repr(self):
        return self.name


class ContractIntegerShiftConstraint(ContractIntegerConstraint):
    shift = StringField(serialized_name=shift_constraint)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def repr(self):
        return f"{self.name},{self.shift}"


class ContractMinMaxConstraint(ContractConstraint):
    name = StringField(serialized_name=constraint_name)
    minValue = StringField(serialized_name=min_constraint_value)
    maxValue = StringField(serialized_name=max_constraint_value)
    minWeight = StringField(serialized_name=min_constraint_weight)
    maxWeight = StringField(serialized_name=max_constraint_weight)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def repr(self):
        return self.name


class ContractMinMaxShiftConstraint(ContractMinMaxConstraint):
    shift = StringField(serialized_name=shift_constraint)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def repr(self):
        return f"{self.name},{self.shift}"


class ContractBooleanConstraint(ContractConstraint):
    name = StringField(serialized_name=constraint_name)
    weight = StringField(serialized_name=constraint_weight)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def repr(self):
        return self.name


class ContractUnwantedPatterns(ContractConstraint):
    name = StringField(serialized_name=constraint_name)
    pattern_elements = ObjectListField(
        PatternElement, serialized_name=unwanted_pattern_elements)
    weight = StringField(serialized_name=constraint_weight)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def to_json(self):
        array = [element.to_json()
                 for element in self.pattern_elements]
        return {
            constraint_name: self.name,
            constraint_weight: self.weight,
            unwanted_pattern_elements: array
        }


class ContractAlternativeShift(ContractConstraint):
    name = StringField(serialized_name=constraint_name)
    shift = StringField(serialized_name=shift_constraint)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def repr(self):
        return f"{self.name},{self.shift}"
