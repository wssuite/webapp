from constants import contract_name, contract_skills, \
    contract_constraints, constraint_name, \
    constraint_weight, alternative_shift, \
    shift_constraint, sub_contract_names
general_contract_dict = {
    contract_name: "General",
    sub_contract_names: [],
    contract_skills: [],
    contract_constraints: [
        {
            constraint_name: alternative_shift,
            shift_constraint: "Early",
            constraint_weight: "hard"
        }
    ]
}

full_time_not_valid_contract_with_general = {
    contract_name: "FullTime",
    sub_contract_names: ["General"],
    contract_skills: [],
    contract_constraints: [
        {
            constraint_name: alternative_shift,
            shift_constraint: "Early",
            constraint_weight: "1.0"
        }
    ]
}

full_time_valid_contract_with_general = {
    contract_name: "FullTime",
    sub_contract_names: ["General"],
    contract_skills: [],
    contract_constraints: [
        {
            constraint_name: alternative_shift,
            shift_constraint: "Late",
            constraint_weight: "1.0"
        }
    ]
}
