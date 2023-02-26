"""Nurse fields"""
nurse_name = "name"
nurse_contracts = "contracts"
nurse_id = "nurse_id"
nurse_username = "username"

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

number_of_free_days_after_shift \
    = "NumberOfFreeDaysAfterShift"
total_weekends_in_four_weeks \
    = "TotalWeekendsInFourWeeks"
min_max_consecutive_shift_type \
    = "MinMaxConsecutiveShiftType"
min_max_consecutive_weekends \
    = "MinMaxConsecutiveWeekends"
min_max_num_assignments_in_four_weeks \
    = "MinMaxNumAssignmentsInFourWeeks"
complete_weekends = "CompleteWeekends"
identical_shift_during_weekend \
    = "IdentShiftTypesDuringWeekend"
alternative_shift = "AlternativeShift"
unwanted_pattern = "unwantedPatterns"


"""Contract"""
sub_contract_names = "subContractNames"
contract_name = "name"
contract_constraints = "constraints"
contract_skills = "skills"
sub_contract_limit = "sub_contract_limit"
depended_contracts = "depended_contracts"
contract_shifts = "shifts"

ok_message = "ok"
