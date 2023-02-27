from constants import (
    contract_name,
    contract_skills,
    contract_constraints,
    constraint_name,
    constraint_weight,
    alternative_shift,
    shift_constraint,
    user_username,
    admin,
    user_password,
)

general_contract_dict = {
    contract_name: "General",
    contract_skills: [],
    contract_constraints: [
        {
            constraint_name: alternative_shift,
            shift_constraint: "Early",
            constraint_weight: "hard",
        }
    ],
}

full_time_not_valid_contract_with_general = {
    contract_name: "FullTime_Not_Valid",
    contract_skills: [],
    contract_constraints: [
        {
            constraint_name: alternative_shift,
            shift_constraint: "Early",
            constraint_weight: "1.0",
        }
    ],
}

full_time_valid_contract_with_general = {
    contract_name: "FullTime_Valid",
    contract_skills: [],
    contract_constraints: [
        {
            constraint_name: alternative_shift,
            shift_constraint: "Late",
            constraint_weight: "1.0",
        }
    ],
}

full_time_valid_contract_with_general_update = {
    contract_name: "FullTime_Valid",
    contract_skills: [],
    contract_constraints: [
        {
            constraint_name: alternative_shift,
            shift_constraint: "Early",
            constraint_weight: "1.0",
        }
    ],
}

random_hex = "12345678123456781234567812345678"

default_user = {user_password: admin, user_username: admin}
