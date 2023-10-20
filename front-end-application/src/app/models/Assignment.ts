export interface Assignment {
  date: string;
  employee_uname: string;
  shift: string;
  skill: string;
}
export interface EmployeeAssignments {
  employee_uname: string;
  assignments: Assignment[];
}

export interface EmployeeSchedule {
  startDate: string;
  endDate: string;
  schedule: EmployeeAssignments[];
}
