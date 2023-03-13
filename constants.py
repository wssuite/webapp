"""Nurse fields"""
nurse_name = "name"
nurse_contracts = "contracts"
nurse_id = "nurse_id"
nurse_username = "username"
nurse_inherited_contracts = "inherited_contracts"
nurse_contract_groups = "contract_groups"

"""Nurse group fields"""
nurse_group_name = "name"
nurse_group_nurses_list = "nurses"
nurse_group_contracts_list = "contracts"
nurse_group_contract_groups = nurse_contract_groups

"""assignment fields"""
assignment_date = "date"
assignment_employee_name = "employee_name"
assignment_shift = "shift"
assignment_skill = "skill"
assignments_string = "assignments"

schedule_string = "schedule"

"""Planning Horizon"""
end_date = "endDate"
start_date = "startDate"

"""Mongo specific"""
mongo_id_field = "_id"
mongo_set_operation = "$set"
mongo_all_operation = "$all"

"""Constraints"""
constraint_name = "name"
integer_constraint_value = "value"
constraint_weight = "weight"
shift_constraint = "shiftId"
min_constraint_value = "minValue"
min_constraint_weight = "minWeight"
max_constraint_value = "maxValue"
max_constraint_weight = "maxWeight"
pattern_element_shift = shift_constraint
pattern_element_day = "dayName"
unwanted_pattern_elements = "patternElements"

number_of_free_days_after_shift = "NumberOfFreeDaysAfterShift"
total_weekends_in_four_weeks = "TotalWeekendsInFourWeeks"
min_max_consecutive_shift_type = "MinMaxConsecutiveShiftType"
min_max_consecutive_weekends = "MinMaxConsecutiveWeekends"
min_max_num_assignments_in_four_weeks = "MinMaxNumAssignmentsInFourWeeks"
complete_weekends = "CompleteWeekends"
identical_shift_during_weekend = "IdentShiftTypesDuringWeekend"
alternative_shift = "AlternativeShift"
unwanted_pattern = "unwantedPatterns"
unwanted_skills = "unwantedSkills"

"""Contract"""
sub_contract_names = "subContractNames"
contract_name = "name"
contract_constraints = "constraints"
contract_skills = "skills"
skill_name = "name"

"""shift"""
shift_name = "name"
shift_start_time = "startTime"
shift_end_time = "endTime"

"""Shift group"""
shift_group_name = "name"
shift_group_shifts_list = "shifts"

"""Shift Type"""
shift_type_name = "name"
shift_type_shifts_lists = "shifts"
sub_contract_limit = "sub_contract_limit"
depended_contracts = "depended_contracts"
contract_shifts = "shifts"

ok_message = "ok"


"""User"""
user_username = "username"
user_password = "password"
user_token = "token"
empty_token = "empty"
admin = "admin"
utf8 = "utf-8"

work = "Work"
rest = "Rest"
is_admin = "isAdmin"
profile = "profile"

"""Profile"""
profile_name = "profile"
profile_access = "access"
profile_creator = "creator"

work_shift_group = {
    shift_group_name: work,
    shift_group_shifts_list: [],
}
rest_shift_group = {
    shift_group_name: rest,
    shift_group_shifts_list: [],
}

duplicate_name = "other_profile_name"

"""Contract group"""
contract_group_name = "name"
contract_group_contracts_list = "contracts"
