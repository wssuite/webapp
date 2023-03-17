from src.models.string_reader import StringReader
from src.models.stringify import Stringify
from pykson import StringField, ObjectListField, ListField
from constants import (
    constraint_name,
    integer_constraint_value,
    constraint_weight,
    shift_constraint,
    min_constraint_value,
    max_constraint_value,
    min_constraint_weight,
    max_constraint_weight,
    unwanted_pattern_elements,
    contract_skills, bind_map,
)
from src.models.pattern_element import PatternElement
from src.models.jsonify import Jsonify
from src.utils.import_util import sanitize_array, Wrapper

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


class ContractConstraint(BaseConstraint, StringReader):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def repr(self):
        pass

    def get_shift(self):
        return []

    def get_skills(self):
        return []

    def read_line(self, line):
        pass


class ContractIntegerConstraint(ContractConstraint):
    name = StringField(serialized_name=constraint_name)
    value = StringField(serialized_name=integer_constraint_value)
    weight = StringField(serialized_name=constraint_weight)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def repr(self):
        return self.name

    def read_line(self, line):
        tokens = line.split(',')
        tokens = sanitize_array(tokens)
        wrapper = Wrapper(tokens)
        self.name = bind_map[wrapper.get_by_index(0).lower()]
        self.value = wrapper.get_by_index(1)
        self.weight = wrapper.get_by_index(2)
        return self


class ContractIntegerShiftConstraint(ContractIntegerConstraint):
    shift = StringField(serialized_name=shift_constraint)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def repr(self):
        return f"{self.name},{self.shift}"

    def get_shift(self):
        return [self.shift]

    def read_line(self, line):
        tokens = line.split(',')
        tokens = sanitize_array(tokens)
        wrapper = Wrapper(tokens)
        self.name = bind_map[wrapper.get_by_index(0).lower()]
        self.shift = wrapper.get_by_index(1)
        self.value = wrapper.get_by_index(2)
        self.weight = wrapper.get_by_index(3)
        return self


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

    def read_line(self, line):
        tokens = line.split(',')
        tokens = sanitize_array(tokens)
        wrapper = Wrapper(tokens)
        self.name = bind_map[wrapper.get_by_index(0).lower()]
        self.minValue = wrapper.get_by_index(1)
        self.minWeight = wrapper.get_by_index(2)
        self.maxValue = wrapper.get_by_index(3)
        self.maxWeight = wrapper.get_by_index(4)
        return self


class ContractMinMaxShiftConstraint(ContractMinMaxConstraint):
    shift = StringField(serialized_name=shift_constraint)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def repr(self):
        return f"{self.name},{self.shift}"

    def get_shift(self):
        return [self.shift]

    def read_line(self, line):
        tokens = line.split(',')
        tokens = sanitize_array(tokens)
        wrapper = Wrapper(tokens)
        self.name = bind_map[wrapper.get_by_index(0).lower()]
        self.shift = wrapper.get_by_index(1)
        self.minValue = wrapper.get_by_index(2)
        self.minWeight = wrapper.get_by_index(3)
        self.maxValue = wrapper.get_by_index(4)
        self.maxWeight = wrapper.get_by_index(5)
        return self


class ContractBooleanConstraint(ContractConstraint):
    name = StringField(serialized_name=constraint_name)
    weight = StringField(serialized_name=constraint_weight)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def repr(self):
        return self.name

    def read_line(self, line):
        tokens = line.split(',')
        tokens = sanitize_array(tokens)
        wrapper = Wrapper(tokens)
        self.name = bind_map[wrapper.get_by_index(0).lower()]
        self.weight = wrapper.get_by_index(1)
        return self


class ContractUnwantedPatterns(ContractConstraint):
    name = StringField(serialized_name=constraint_name)
    pattern_elements = ObjectListField(
        PatternElement, serialized_name=unwanted_pattern_elements
    )
    weight = StringField(serialized_name=constraint_weight)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def to_json(self):
        array = [element.to_json() for element in self.pattern_elements]
        return {
            constraint_name: self.name,
            constraint_weight: self.weight,
            unwanted_pattern_elements: array,
        }

    def read_line(self, line):
        tokens = line.split(',')
        tokens = sanitize_array(tokens)
        wrapper = Wrapper(tokens)
        self.name = bind_map[wrapper.get_by_index(0).lower()]
        self.pattern_elements = []
        i = 1

        while i < len(tokens) - 1:
            new_line = wrapper.get_by_index(i) + "," + \
                       wrapper.get_by_index(i+1)
            self.pattern_elements.append(PatternElement().read_line(new_line))
            i += 2

        self.weight = wrapper.get_by_index(len(tokens) - 1)
        return self

    def get_shift(self):
        shifts = []
        for element in self.pattern_elements:
            for shift in element.get_shift():
                if shift not in shifts:
                    shifts.append(shift)

        return shifts


class ContractAlternativeShift(ContractConstraint):
    name = StringField(serialized_name=constraint_name)
    shift = StringField(serialized_name=shift_constraint)
    weight = StringField(serialized_name=constraint_weight)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def repr(self):
        return f"{self.name},{self.shift}"

    def get_shift(self):
        return [self.shift]

    def read_line(self, line):
        tokens = line.split(',')
        tokens = sanitize_array(tokens)
        wrapper = Wrapper(tokens)
        self.name = bind_map[wrapper.get_by_index(0).lower()]
        self.shift = wrapper.get_by_index(1)
        self.weight = wrapper.get_by_index(2)
        return self


class ContractUnwantedSkills(ContractConstraint):
    name = StringField(serialized_name=constraint_name)
    unwanted_skills = ListField(str, serialized_name=contract_skills)
    weight = StringField(serialized_name=constraint_weight)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def repr(self):
        return self.name

    def get_skills(self):
        return self.unwanted_skills

    def read_line(self, line):
        tokens = line.split(',')
        tokens = sanitize_array(tokens)
        wrapper = Wrapper(tokens)
        self.name = bind_map[wrapper.get_by_index(0).lower()]
        for i in range(1, len(tokens) - 1):
            self.unwanted_skills.append(wrapper.get_by_index(i))

        self.weight = wrapper.get_by_index(len(tokens) - 1)
        return self
