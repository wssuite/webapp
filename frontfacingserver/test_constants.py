from constants import (
    contract_name,
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
    skill_name,
    shift_type_name,
    shift_type_shifts_lists,
    shift_group_name,
    shift_group_shifts_list,
    profile,
    profile_name,
    profile_creator,
    profile_access,
    user_token,
    unwanted_skills,
    contract_skills,
    contract_group_name,
    contract_group_contracts_list,
    nurse_contract_groups,
    nurse_group_contract_groups,
    shift_group_shift_types,
    demand_day,
    demand_date,
    demand_shift,
    demand_max_value,
    demand_max_weight,
    demand_min_weight,
    demand_min_value,
    demand_skill,
    worker_host,
    previous_versions,
    state,
    version,
    end_date,
    start_date,
)

profile1 = "profile1"
profile2 = "profile2"

general_contract_dict = {
    contract_name: "General",
    profile: profile1,
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
    profile: profile1,
    contract_constraints: [
        {
            constraint_name: alternative_shift,
            shift_constraint: "Early",
            constraint_weight: "1.0",
        }
    ],
}

full_time_valid_contract_with_general = {
    contract_name: "FullTime Valid",
    profile: profile1,
    contract_constraints: [
        {
            constraint_name: alternative_shift,
            shift_constraint: "Late",
            constraint_weight: "1.0",
        }
    ],
}

full_time_valid_contract_with_general_update_to_invalid = {
    contract_name: "FullTime Valid",
    profile: profile1,
    contract_constraints: [
        {
            constraint_name: alternative_shift,
            shift_constraint: "Early",
            constraint_weight: "1.0",
        }
    ],
}

full_time_contract_with_day_shift_type = {
    contract_name: "FullTime Valid",
    profile: profile1,
    contract_constraints: [
        {
            constraint_name: alternative_shift,
            shift_constraint: "Day",
            constraint_weight: "1.0",
        }
    ],
}

min_cons_contract = {
    contract_name: "minConsContract",
    profile: profile1,
    contract_constraints: [
        {
            constraint_name: min_max_consecutive_weekends,
            max_constraint_value: "5.0",
            max_constraint_weight: "hard",
            min_constraint_value: "1.0",
            min_constraint_weight: "5.0",
            shift_constraint: "Early",
        }
    ],
}

contract_group_without_contradiction = {
    contract_group_name: "contract_group_without_contradiction",
    contract_group_contracts_list: ["minConsContract"],
    profile: profile1,
}
contract_group_with_contradiction = {
    contract_group_name: "contract_group_with_contradiction",
    contract_group_contracts_list: ["General", "FullTime_Not_Valid"],
    profile: profile1,
}

unwanted_skills_contract = {
    contract_name: "unwantedSkillsContract",
    profile: profile1,
    contract_constraints: [
        {
            constraint_name: unwanted_skills,
            contract_skills: ["Nurse"],
            constraint_weight: "hard",
        }
    ],
}

early_shift = {
    shift_name: "Early",
    shift_start_time: "08:00:00",
    shift_end_time: "16:00:00",
    profile: profile1,
}

late_shift = {
    shift_name: "Late",
    shift_start_time: "18:00:00",
    shift_end_time: "24:00:00",
    profile: profile1,
}
day_shift_type = {
    shift_type_name: "Day",
    shift_type_shifts_lists: ["Early"],
    profile: profile1,
}
night_shift_type = {
    shift_type_name: "Night",
    shift_type_shifts_lists: ["Late"],
    profile: profile1,
}
work_shift_group = {
    shift_group_name: "Work",
    shift_group_shifts_list: [],
    profile: profile1,
    shift_group_shift_types: [],
}
rest_shift_group = {
    shift_group_name: "Rest",
    shift_group_shifts_list: [],
    profile: profile1,
    shift_group_shift_types: [],
}

day_shift_group = {
    shift_group_name: "Day",
    shift_group_shifts_list: ["Early"],
    profile: profile1,
    shift_group_shift_types: [],
}
night_shift_group = {
    shift_group_name: "Night",
    shift_group_shifts_list: [],
    profile: profile1,
    shift_group_shift_types: [],
}
test_work_shift_group = work_shift_group.copy()
test_work_shift_group[shift_group_shifts_list] = ["Day"]

nurse1 = {
    nurse_name: "nurse1",
    nurse_contracts: ["FullTime Valid", "minConsContract"],
    nurse_username: "nurse1",
    profile: profile1,
    nurse_contract_groups: [],
}

nurse_group1 = {
    nurse_group_name: "group1",
    nurse_group_nurses_list: ["nurse1"],
    nurse_group_contracts_list: ["General"],
    profile: profile1,
}
random_hex = "12345678123456781234567812345678"
random_hex2 = "12345678123456781234567812345679"

nurse_group2 = {
    nurse_group_name: "group2",
    nurse_group_nurses_list: [],
    nurse_group_contracts_list: ["FullTime Valid", "minConsContract"],
    profile: profile1,
}
user1_name = "user1"
default_user = {user_password: admin, user_username: admin}
user1 = {
    user_password: admin,
    user_username: user1_name,
    user_token: random_hex2,
}
nurse_skill = {
    skill_name: "Nurse",
    profile: profile1,
}
head_nurse_skill = {
    skill_name: "HeadNurse",
    profile: profile1,
}
sociologist_skill = {
    skill_name: "Sociologist",
    profile: profile1,
}
skill_array = ["Nurse", "HeadNurse", "Sociologist", "Nurse"]

patrick_nurse = {
    nurse_name: "Patrick",
    nurse_contracts: ["FullTime Valid"],
    nurse_username: "patrick",
    profile: profile1,
    nurse_contract_groups: [],
}

nurse_with_contract_group = {
    nurse_name: "Random nurse",
    nurse_contracts: [],
    nurse_username: "random",
    profile: profile1,
    nurse_contract_groups: ["contract_group_without_contradiction"],
}

patrick_nurse_group = {
    nurse_group_name: "patrick's group",
    nurse_group_nurses_list: ["patrick"],
    nurse_group_contracts_list: ["General"],
    profile: profile1,
    nurse_contract_groups: [],
}

problematic_nurse_group = {
    nurse_group_name: "problematic group",
    nurse_group_contracts_list: ["FullTime_Not_Valid"],
    nurse_group_nurses_list: ["patrick"],
    profile: profile1,
    nurse_group_contract_groups: [],
}

not_problematic_group = {
    nurse_group_name: "not problematic_group",
    nurse_group_contracts_list: [],
    nurse_group_nurses_list: ["patrick"],
    profile: profile1,
    nurse_group_contract_groups: [],
}

nurse_group_with_contract_groups = {
    nurse_group_name: "random_group",
    nurse_group_contracts_list: [],
    nurse_group_nurses_list: [],
    profile: profile1,
    nurse_group_contract_groups: ["contract_group_without_contradiction"],
}

test_profile = {
    profile_name: profile1,
    profile_creator: admin,
    profile_access: [admin],
}

hospital_demand_element = {
    demand_date: "2010-06-01",
    demand_day: "Monday",
    demand_skill: "Nurse",
    demand_shift: "Early",
    demand_min_value: "1.0",
    demand_max_value: "5.0",
    demand_min_weight: "6.0",
    demand_max_weight: "hard",
}

solution1 = {
    start_date: "2023-06-01",
    end_date: "2023-06-02",
    profile: profile1,
    version: "1",
    state: "Running",
    previous_versions: [],
    worker_host: "192.256.22.0",
}

solution2 = {
    start_date: "2023-06-01",
    end_date: "2023-06-02",
    profile: profile1,
    version: "2",
    state: "Running",
    previous_versions: ["1"],
    worker_host: "192.256.22.0",
}
