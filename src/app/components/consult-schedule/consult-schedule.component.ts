import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import * as saveAs from "file-saver";
import { MAIN_MENU } from "src/app/constants/app-routes";
import { Assignment } from "src/app/models/Assignment";
import { DetailedSchedule, Solution } from "src/app/models/Schedule";
import { ScheduleService } from "src/app/services/schedule/schedule-service.service";
import { CacheUtils } from "src/app/utils/CacheUtils";
import { DateUtils } from "src/app/utils/DateUtils";
import { ErrorMessageDialogComponent } from "../error-message-dialog/error-message-dialog.component";

@Component({
  selector: "app-consult-schedule",
  templateUrl: "./consult-schedule.component.html",
  styleUrls: ["./consult-schedule.component.css"],
})
export class ConsultScheduleComponent implements OnInit {

  schedule!: DetailedSchedule;
  connectedUser: boolean;
  employeeAssignmentsMap: Map<string, Assignment[]>;
  endDate: Date | undefined;
  startDate: Date | undefined;
  validSchedule: boolean;
  nbColumns: number | undefined;
  indexes: number[] | undefined;
  displayedColumns: string[];
  dataSource: MatTableDataSource<Solution>
  preferences: Map<string, string>

  constructor(private service: ScheduleService, public dialog: MatDialog, private router: Router) {
    this.employeeAssignmentsMap = new Map();
    this.connectedUser = false;
    this.validSchedule = false;
    this.dataSource = new MatTableDataSource();
    this.displayedColumns = ["startDate", "endDate", "versionNumber", "state", "actions"]
    this.preferences = new Map();
  }

  ngOnInit(): void {
    if(this.service.selectedScheduleToView === undefined){
      return
    }
    try{
      this.getDetailedSchedule(this.service.selectedScheduleToView);
      this.connectedUser = true;
    }
    catch(err){
      // Do noting
    }
  }

  getDetailedSchedule(schedule: Solution) {
    this.employeeAssignmentsMap = new Map()
    this.preferences = new Map()
    this.service.getDetailedSolution(schedule).subscribe({
      next: (data: DetailedSchedule)=>{
        this.schedule = data;
        if(this.schedule.schedule){
          this.startDate = new Date(this.schedule.schedule.startDate)
          this.endDate = new Date(this.schedule.schedule.endDate);
          this.nbColumns =
            DateUtils.nbDaysDifference(this.endDate, this.startDate) + 1;
            this.indexes = this.getIndexes();
          for (const sch of this.schedule.schedule.schedule) {
            this.employeeAssignmentsMap.set(sch.employee_name, sch.assignments);
            for(const assignement of sch.assignments){
              //console.log(assignement.date)
              this.preferences.set(JSON.stringify({nurse: assignement.employee_name,
                 shift: assignement.shift, date:assignement.date}),"");
            }
          }
          console.log(this.preferences)
        }
        this.dataSource.data = data.previousVersions;
        this.validSchedule = true;
      },
      error: (err: HttpErrorResponse)=>{
        this.openErrorDialog(err.error)
      }
    })
  }

  openErrorDialog(message: string){
    this.dialog.open(ErrorMessageDialogComponent, {
      data: {message: message}
    })
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
        ret = assignment.skill + "\n" + assignment.shift;
        break;
      }
    }
    return ret;
  }

  getPreference(name: string, index: number): string|undefined{
    const date = this.getDateDayStringByIndex(index);
    const assignments = this.employeeAssignmentsMap.get(name);
    //console.log(assignments === undefined)
    if(assignments === undefined){
      return undefined
    }
    let shift = "";
    for(const assignement of assignments){
      if(assignement.date === date) {
        shift = assignement.shift;
        break;
      }
    }
    const key = JSON.stringify({nurse: name,
      shift: shift,
      date: date})
    return this.preferences.get(key)
  }

  getButtonStyle(name: string, index: number){
    const pref = this.getPreference(name, index);
    if(pref !== undefined){
      if(pref === "ON"){
        return {'background-color': 'rgb(228, 241, 226)', "height":"60px"};
      }
      else if(pref === "OFF"){
        return {'background-color': 'rgb(246, 233, 232)', "height":"60px" };
      }
      return { 'background-color': 'rgb(235, 234, 234)', "height":"60px" };
    }
    return { 'background-color': 'rgb(235, 234, 234)' , "height":"60px"};
  }

  updatePreference(name: string, index: number): void {
    const date = this.getDateDayStringByIndex(index);
    const assignments = this.employeeAssignmentsMap.get(name);
    //console.log(assignments === undefined)
    if(assignments === undefined){
      return undefined
    }
    let shift = "";
    for(const assignement of assignments){
      if(assignement.date === date) {
        shift = assignement.shift;
        break;
      }
    }
    const key = JSON.stringify({nurse: name,
      shift: shift,
      date: date})

    const oldPref= this.preferences.get(key)
    if(oldPref !== undefined){
      if(oldPref === ""){
        this.preferences.set(key, "ON")
      }
      else if(oldPref === "ON"){
        this.preferences.set(key,"OFF")
      }
      else{
        this.preferences.set(key, "")
      }
    }

  }

  viewSchedule(schedule: Solution){
    this.getDetailedSchedule(schedule);
  }

  exportProblem(schedule: Solution) {
    this.service.exportProblem(schedule).subscribe({
      next: (data: {content: string})=>{
        const file = new File([data.content], CacheUtils.getProfile() + "_" + schedule.startDate + "_" + schedule.endDate + "_" + schedule.version + ".txt", {type:"text/plain;charset=utf-8"});
        saveAs(file);
      }
    })
  }

  exportCurrentScheduleProblem() {
    this.service.exportProblemCurrentSchedule(this.schedule.version, this.schedule.startDate, this.schedule.endDate).subscribe({
      next: (data: {content: string})=>{
        const file = new File([data.content], CacheUtils.getProfile() + "_" + this.schedule.startDate + "_" + this.schedule.endDate + "_" + this.schedule.version + ".txt", {type:"text/plain;charset=utf-8"});
        saveAs(file);
      }
    })
  }

  regenerateSchedule() {
    this.service.regenerateSchedule(this.schedule.version, this.schedule.problem).subscribe({
      next: ()=> this.router.navigate(["/" + MAIN_MENU]),
      error: (err: HttpErrorResponse)=>{
        if(err.status === HttpStatusCode.Ok){
          this.router.navigate(["/" + MAIN_MENU]);
        }
        else{
          this.openErrorDialog(err.error);
        }
      }
    })
  }
}
