from constants import (
    contract_name,
    contract_constraints,
    constraint_name,
    constraint_weight,
    alternative_shift,
    shift_constraint,
    admin,
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
    number_of_free_days_after_shift,
    integer_constraint_value,
    identical_shift_during_weekend,
    total_weekends_in_four_weeks,
    min_max_consecutive_shift_type,
    complete_weekends,
    unwanted_pattern_elements,
    unwanted_pattern,
    pattern_element_day,
    pattern_element_shift,
)
from src.models.nurse_group import NurseGroup
from test_constants import default_user, random_hex, profile1
from src.models.hospital_demand import (
    Nurse,
    Contract,
    ContractGroup,
    Skill,
    Shift,
    ShiftGroup,
    ShiftType,
)
from src.handlers.base_handler import BaseHandler

late_shift_dict = {
    shift_name: "Late",
    shift_start_time: "16:00:00",
    shift_end_time: "24:00:00",
    profile: "profile1",
}

mid_day_shift_dict = {
    shift_name: "MidDay",
    shift_start_time: "12:00:00",
    shift_end_time: "16:00:00",
    profile: "profile1",
}

early_shift_dict = {
    shift_name: "Early",
    shift_start_time: "08:00:00",
    shift_end_time: "16:00:00",
    profile: "profile1",
}

night_shift_type_dict = {
    shift_type_name: "Night",
    shift_type_shifts_lists: ["Late"],
    profile: "profile1",
}

day_shift_type_dict = {
    shift_type_name: "Day",
    shift_type_shifts_lists: ["Early", "MidDay"],
    profile: "profile1",
}

work_shift_group_dict = {
    shift_group_name: "Work",
    shift_group_shifts_list: ["Early", "MidDay", "Late"],
    shift_group_shift_types: ["Day", "Night"],
    profile: profile1,
}

rest_shift_group_dict = {
    shift_group_name: "Rest",
    shift_group_shifts_list: [],
    shift_group_shift_types: [],
    profile: profile1,
}

head_nurse_skill_dict = {skill_name: "HeadNurse", profile: "profile1"}

nurse_skill_dict = {skill_name: "Nurse", profile: "profile1"}

general_contract_dict = {
    contract_name: "General",
    contract_constraints: [
        {
            constraint_name: number_of_free_days_after_shift,
            integer_constraint_value: "1.0",
            constraint_weight: "hard",
            shift_constraint: "Late",
        },
        {
            constraint_name: min_max_consecutive_weekends,
            min_constraint_value: "1.0",
            min_constraint_weight: "5.0",
            max_constraint_value: "3.0",
            max_constraint_weight: "hard",
            shift_constraint: "Early",
        },
    ],
    profile: "profile1",
}

nurse_contract_dict = {
    contract_name: "Nurses contracts",
    contract_constraints: [
        {
            constraint_name: unwanted_skills,
            contract_skills: ["HeadNurse"],
            constraint_weight: "hard",
        },
        {
            constraint_name: total_weekends_in_four_weeks,
            min_constraint_value: "1.0",
            min_constraint_weight: "5.0",
            max_constraint_value: "5.0",
            max_constraint_weight: "hard",
            shift_constraint: "Early",
        },
        {
            constraint_name: identical_shift_during_weekend,
            constraint_weight: "hard",
        },
    ],
    profile: "profile1",
}

head_nurse_contract_dict = {
    contract_name: "Head nurses contracts",
    contract_constraints: [
        {
            constraint_name: unwanted_skills,
            contract_skills: ["Nurse"],
            constraint_weight: "hard",
        },
        {
            constraint_name: total_weekends_in_four_weeks,
            min_constraint_value: "1.0",
            min_constraint_weight: "5.0",
            max_constraint_value: "3.0",
            max_constraint_weight: "hard",
            shift_constraint: "Early",
        },
        {
            constraint_name: identical_shift_during_weekend,
            constraint_weight: "hard",
        },
    ],
    profile: "profile1",
}

patrick_contract_dict = {
    contract_name: "patricks contract",
    contract_constraints: [
        {
            constraint_name: min_max_consecutive_shift_type,
            min_constraint_value: "1.0",
            max_constraint_value: "3.0",
            min_constraint_weight: "hard",
            max_constraint_weight: "hard",
            shift_constraint: "Late",
        },
        {constraint_name: complete_weekends, constraint_weight: "5.0"},
        {
            constraint_name: alternative_shift,
            shift_constraint: "MidDay",
            constraint_weight: "hard",
        },
        {
            constraint_name: unwanted_pattern,
            unwanted_pattern_elements: [
                {
                    pattern_element_day: ["Monday", "Friday"],
                    pattern_element_shift: ["Late"],
                },
                {
                    pattern_element_day: ["Tuesday", "Saturday"],
                    pattern_element_shift: ["Early", "MidDay"],
                },
            ],
            constraint_weight: "hard",
        },
    ],
    profile: "profile1",
}

eve_contract_dict = {
    contract_name: "eves contract",
    contract_constraints: [
        {
            constraint_name: min_max_consecutive_shift_type,
            min_constraint_value: "1.0",
            max_constraint_value: "3.0",
            min_constraint_weight: "hard",
            max_constraint_weight: "hard",
            shift_constraint: "Late",
        },
        {constraint_name: complete_weekends, constraint_weight: "5.0"},
        {
            constraint_name: alternative_shift,
            shift_constraint: "Late",
            constraint_weight: "hard",
        },
        {
            constraint_name: unwanted_pattern,
            unwanted_pattern_elements: [
                {
                    pattern_element_day: ["Monday", "Friday"],
                    pattern_element_shift: ["Late"],
                },
                {
                    pattern_element_day: ["Tuesday", "Saturday"],
                    pattern_element_shift: ["Early", "MidDay"],
                },
            ],
            constraint_weight: "hard",
        },
    ],
    profile: "profile1",
}

patrick_nurse_dict = {
    nurse_name: "patrick",
    nurse_contracts: ["patricks contract"],
    profile: "profile1",
    nurse_contract_groups: [],
    nurse_username: "patrick",
}

eve_nurse_dict = {
    nurse_name: "Eve",
    nurse_contracts: ["eves contract"],
    profile: "profile1",
    nurse_contract_groups: [],
    nurse_username: "eve",
}

nurse2_dict = patrick_nurse_dict.copy()
nurse2_dict[nurse_username] = "nurse2"
nurse3_dict = patrick_nurse_dict.copy()
nurse3_dict[nurse_username] = "nurse3"

head_nurse2_dict = eve_nurse_dict.copy()
head_nurse2_dict[nurse_username] = "head nurse 2"
head_nurse3_dict = eve_nurse_dict.copy()
head_nurse3_dict[nurse_username] = "head nurse 3"

head_nurse_contract_group_dict = {
    contract_group_name: "head nurse contract group",
    contract_group_contracts_list: ["Head nurses contracts"],
    profile: "profile1",
}

nurse_contract_group_dict = {
    contract_group_name: "nurse contract group",
    contract_group_contracts_list: ["Nurses contracts"],
    profile: "profile1",
}

nurse_group_nurse_dict = {
    nurse_group_name: "nurse group",
    nurse_group_contracts_list: ["General"],
    nurse_group_nurses_list: ["patrick", "nurse2", "nurse3"],
    nurse_group_contract_groups: ["nurse contract group"],
    profile: "profile1",
}

nurse_group_head_nurse_dict = {
    nurse_group_name: "head nurse group",
    nurse_group_contracts_list: ["General"],
    nurse_group_nurses_list: ["eve", "head nurse 2", "head nurse 3"],
    nurse_group_contract_groups: ["head nurse contract group"],
    profile: "profile1",
}

profile_dict = {
    profile_name: profile1,
    profile_creator: admin,
    profile_access: [admin],
}


def build_db(handler: BaseHandler):
    user = default_user.copy()
    user[user_token] = random_hex
    handler.user_dao.insert_one(user)
    handler.profile_dao.insert_if_not_exist(profile_dict)
    """Insert skills"""
    nurse_skill = Skill().from_json(nurse_skill_dict)
    head_nurse_skill = Skill().from_json(head_nurse_skill_dict)
    handler.skill_dao.insert_one_if_not_exist(nurse_skill.db_json())
    handler.skill_dao.insert_one_if_not_exist(head_nurse_skill.db_json())

    """Insert shifts"""
    early_shift = Shift().from_json(early_shift_dict)
    mid_day_shift = Shift().from_json(mid_day_shift_dict)
    late_shift = Shift().from_json(late_shift_dict)
    handler.shift_dao.insert_one_if_not_exist(early_shift.db_json())
    handler.shift_dao.insert_one_if_not_exist(mid_day_shift.db_json())
    handler.shift_dao.insert_one_if_not_exist(late_shift.db_json())

    """Insert shift types"""
    day_shift_type = ShiftType().from_json(day_shift_type_dict)
    night_shift_type = ShiftType().from_json(night_shift_type_dict)
    handler.shift_type_dao.insert_one_if_not_exist(day_shift_type.db_json())
    handler.shift_type_dao.insert_one_if_not_exist(night_shift_type.db_json())

    """Insert shift groups"""
    work_shift_group = ShiftGroup().from_json(work_shift_group_dict)
    rest_shift_group = ShiftGroup().from_json(rest_shift_group_dict)
    handler.shift_group_dao.insert_one_if_not_exist(work_shift_group.db_json())
    handler.shift_group_dao.insert_one_if_not_exist(rest_shift_group.db_json())

    """Insert contracts"""
    head_nurse_contract = Contract().from_json(head_nurse_contract_dict)
    nurse_contract = Contract().from_json(nurse_contract_dict)
    patrick_contract = Contract().from_json(patrick_contract_dict)
    eve_contract = Contract().from_json(eve_contract_dict)
    general_contract = Contract().from_json(general_contract_dict)
    handler.contract_dao.insert_one(general_contract.db_json())
    handler.contract_dao.insert_one(nurse_contract.db_json())
    handler.contract_dao.insert_one(head_nurse_contract.db_json())
    handler.contract_dao.insert_one(patrick_contract.db_json())
    handler.contract_dao.insert_one(eve_contract.db_json())

    """Insert contract groups"""
    head_nurse_contract_group = ContractGroup().from_json(
        head_nurse_contract_group_dict
    )
    nurse_contract_group = ContractGroup().from_json(nurse_contract_group_dict)
    handler.contract_group_dao.insert_if_not_exist(
        head_nurse_contract_group.db_json()
    )
    handler.contract_group_dao.insert_if_not_exist(
        nurse_contract_group.db_json()
    )

    """Insert nurse"""
    patrick_nurse = Nurse().from_json(patrick_nurse_dict)
    nurse2 = Nurse().from_json(nurse2_dict)
    nurse3 = Nurse().from_json(nurse3_dict)
    eve_nurse = Nurse().from_json(eve_nurse_dict)
    head_nurse2 = Nurse().from_json(head_nurse2_dict)
    head_nurse3 = Nurse().from_json(head_nurse3_dict)
    handler.nurse_dao.insert_one(patrick_nurse.db_json())
    handler.nurse_dao.insert_one(nurse2.db_json())
    handler.nurse_dao.insert_one(nurse3.db_json())
    handler.nurse_dao.insert_one(eve_nurse.db_json())
    handler.nurse_dao.insert_one(head_nurse2.db_json())
    handler.nurse_dao.insert_one(head_nurse3.db_json())

    """Insert nurse groups"""
    nurse_group_nurse = NurseGroup().from_json(nurse_group_nurse_dict)
    nurse_group_head_nurse = NurseGroup().from_json(
        nurse_group_head_nurse_dict
    )
    handler.nurse_group_dao.insert_one_if_not_exist(
        nurse_group_nurse.db_json()
    )
    handler.nurse_group_dao.insert_one_if_not_exist(
        nurse_group_head_nurse.db_json()
    )
