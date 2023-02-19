export interface Assignment {
  date: string;
  employee_name: string;
  shift: string;
  skill: string;
}
export interface EmployeeAssignments {
  employee_name: string;
  assignments: Assignment[];
}

export interface EmployeeSchedule {
  startDate: string;
  endDate: string;
  schedule: EmployeeAssignments[];
}
