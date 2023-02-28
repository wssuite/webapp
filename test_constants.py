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
    shift_name,
    shift_start_time,
    shift_end_time,
    nurse_name,
    nurse_contracts,
    nurse_group_name,
    nurse_group_contracts_list,
    nurse_group_nurses_list,
    nurse_username,
    max_constraint_value,
    min_constraint_weight,
    max_constraint_weight,
    min_constraint_value,
    min_max_consecutive_weekends,
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

full_time_valid_contract_with_general_update_to_invalid = {
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

min_cons_contract = {
    contract_name: "minConsContract",
    contract_skills: [],
    contract_constraints: [
        {
            constraint_name: min_max_consecutive_weekends,
            max_constraint_value: "5.0",
            max_constraint_weight: "hard",
            min_constraint_value: "1.0",
            min_constraint_weight: "5.0",
        }
    ],
}

early_shift = {
    shift_name: "Early",
    shift_start_time: "08:00:00",
    shift_end_time: "16:00:00",
}

late_shift = {
    shift_name: "Late",
    shift_start_time: "18:00:00",
    shift_end_time: "24:00:00",
}

nurse1 = {
    nurse_name: "nurse1",
    nurse_contracts: ["FullTime_Valid", "minConsContract"],
    nurse_username: "nurse1",
}

nurse_group1 = {
    nurse_group_name: "group1",
    nurse_group_nurses_list: ["nurse1"],
    nurse_group_contracts_list: ["General"],
}
random_hex = "12345678123456781234567812345678"

nurse_group2 = {
    nurse_group_name: "group2",
    nurse_group_nurses_list: [],
    nurse_group_contracts_list: ["FullTime_Valid", "minConsContract"],
}

default_user = {user_password: admin, user_username: admin}
