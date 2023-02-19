import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Assignment, EmployeeSchedule } from "src/app/models/Assignment";
import { APIService } from "src/app/services/api-service/api.service";
import { DateUtils } from "src/app/utils/DateUtils";
import { ErrorMessageDialogComponent } from "../error-message-dialog/error-message-dialog.component";

@Component({
  selector: "app-consult-schedule",
  templateUrl: "./consult-schedule.component.html",
  styleUrls: ["./consult-schedule.component.css"],
})
export class ConsultScheduleComponent implements OnInit {
  employeeSchedule: EmployeeSchedule;
  employeeAssignmentsMap: Map<string, Assignment[]>;
  startDate: Date | undefined;
  endDate: Date | undefined;
  nbColumns: number | undefined;
  indexes: number[] | undefined;
  validSchedule: boolean;

  //schedule
  constructor(private apiService: APIService, public dialog: MatDialog) {
    this.validSchedule = false;
    this.employeeSchedule = {
      startDate: "",
      endDate: "",
      schedule: [],
    };
    this.employeeAssignmentsMap = new Map();
  }

  ngOnInit(): void {
    this.apiService.getPrototypeSchedule().subscribe(
      (schedule: EmployeeSchedule) => {
        this.employeeSchedule = schedule;
        this.startDate = new Date(this.employeeSchedule.startDate);
        this.endDate = new Date(this.employeeSchedule.endDate);
        this.nbColumns =
          DateUtils.nbDaysDifference(this.endDate, this.startDate) + 1;
        this.indexes = this.getIndexes();
        for (const sch of this.employeeSchedule.schedule) {
          this.employeeAssignmentsMap.set(sch.employee_name, sch.assignments);
        }
        this.validSchedule = true;
      },
      (err: HttpErrorResponse) => {
        this.dialog.open(ErrorMessageDialogComponent, {
          data: { message: err.error },
        });
      }
    );
  }

  getDateDayStringByIndex(index: number): string {
    if (this.startDate == undefined) {
      return "";
    }
    const nextDay = new Date(
      +this.startDate + (index + 1) * DateUtils.dayMultiplicationFactor
    );
    const local_string = nextDay.toLocaleDateString().replaceAll("/", "-");
    return DateUtils.arrangeDateString(local_string);
  }

  getDayString(index: number): string {
    if (this.startDate == undefined) {
      return "";
    }
    const nextDay = new Date(
      +this.startDate + (index + 1) * DateUtils.dayMultiplicationFactor
    ).getDay();
    return DateUtils.days[nextDay] + "\n";
  }
  getIndexes() {
    const indexes: number[] = [];
    if (this.nbColumns == undefined) {
      return [];
    }
    for (let i = 0; i < this.nbColumns; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  getEmployeeShiftSkill(employeeName: string, index: number): string {
    let ret = "";
    const assignments = this.employeeAssignmentsMap.get(employeeName);
    if (assignments === undefined || assignments === null) {
      return ret;
    }
    const date = this.getDateDayStringByIndex(index);
    for (const assignment of assignments) {
      if (assignment.date === date) {
        ret = "skill:" + assignment.skill + "\n shift: " + assignment.shift;
        break;
      }
    }
    return ret;
  }
}
