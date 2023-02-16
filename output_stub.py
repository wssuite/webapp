import random
from datetime import datetime, timedelta

fictive_employees = ["Eve", "Patrick", "Genevieve", "Monique",
                     "Jessica", "Andrew", "Patrice"]

skills = ["Nurse", "HeadNurse", "Pediatrics", "Sociologist"]
shifts = ["Early", "Late", "MidDay", "Night"]

start_date_string = "2023-02-20"
end_date_string = "2023-03-20"


def string_to_date(string):
    return datetime.strptime(string, '%Y-%m-%d').date()


file_content = f'prototype,{start_date_string},{end_date_string}\n'

start_date = string_to_date(start_date_string)
end_date = string_to_date(end_date_string)

dates = []
days_diff = (end_date - start_date).days

file_content += f'Assignments={len(shifts)*days_diff*len(skills)}\n'

for i in range(0, days_diff + 1):
    new_date = start_date + timedelta(days=i)
    dates.append(new_date)

for date in dates:
    for shift in shifts:
        for skill in skills:
            random_number = random.randint(0, len(fictive_employees)-1)
            chosen_employee = fictive_employees[random_number]
            file_content += f'{date},{chosen_employee},{shift},{skill}\n'

print(file_content)

with open("sol.txt", "w") as file:
    file.write(file_content)
