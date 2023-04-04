import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import * as saveAs from "file-saver";
import { MAIN_MENU, VIEW_SCHEDULES } from "src/app/constants/app-routes";
import { Assignment, EmployeeSchedule } from "src/app/models/Assignment";
import { SchedulePreferenceElement } from "src/app/models/GenerationRequest";
import { ContinuousVisualisationInterface, DetailedSchedule, Solution } from "src/app/models/Schedule";
import { ScheduleService } from "src/app/services/schedule/schedule-service.service";
import { CacheUtils } from "src/app/utils/CacheUtils";
import { DateUtils } from "src/app/utils/DateUtils";
import { ErrorMessageDialogComponent } from "../error-message-dialog/error-message-dialog.component";
import { IN_PROGRESS, WAITING } from "src/app/constants/schedule_states";
import { NOTIFICATION_UPDATE, VISUALISATION_UPDATE } from "src/app/constants/socket-events";

interface PreferenceKeyInterface{
  nurse: string,
  shift: string,
  date: string
}

@Component({
  selector: "app-consult-schedule",
  templateUrl: "./consult-schedule.component.html",
  styleUrls: ["./consult-schedule.component.css"],
})
export class ConsultScheduleComponent implements OnInit, OnDestroy, AfterViewInit {

  schedule!: DetailedSchedule;
  employeeSchedule!: EmployeeSchedule;
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
  inPrgressState = IN_PROGRESS

  constructor(private service: ScheduleService, public dialog: MatDialog, private router: Router) {
    this.employeeAssignmentsMap = new Map();
    this.connectedUser = false;
    this.validSchedule = false;
    this.dataSource = new MatTableDataSource();
    this.displayedColumns = ["CreationDate","startDate", "endDate", "versionNumber", "state", "actions"]
    this.preferences = new Map();
  }

  ngOnInit(): void {
    try{
      if(this.service.selectedScheduleToView){
        this.getDetailedSchedule(this.service.selectedScheduleToView);
      }
      else{
        const currentSchedule = CacheUtils.getCurrentSchedule()
        if(currentSchedule){
          this.getDetailedSchedule(currentSchedule);
        }
      }
      this.connectedUser = true;
      if(this.service.socket === undefined){
        this.service.connectSocket()
      }
    }
    catch(err){
      // Do noting
    }
  }

  ngOnDestroy(): void {
    this.savePreferences()
    if(CacheUtils.getContinuousVisulaisation()){
      this.service.unsubscribeContinuousVisulation({
        startDate: this.schedule.startDate,
        endDate: this.schedule.endDate,
        profile: this.schedule.profile,
        version: this.schedule.version
      })
    }  
  }

  ngAfterViewInit(): void {
      this.service.socket.on(VISUALISATION_UPDATE, (schedule: EmployeeSchedule)=>{
        this.employeeSchedule = schedule
        this.updateAssignments(schedule)
      })
      this.service.socket.on(NOTIFICATION_UPDATE, (sol: Solution)=>{
        this.getDetailedSchedule(sol);
        const savedNotifSub: ContinuousVisualisationInterface = {
          startDate: sol.startDate,
          endDate: sol.endDate,
          profile: sol.profile,
          version: sol.version,
        }
        if(sol.state !== IN_PROGRESS && CacheUtils.getContinuousVisulaisation()){
          if(sol.state!== WAITING && CacheUtils.isNotifSubscription(savedNotifSub)){
            CacheUtils.removeNotifSubscription(savedNotifSub)
            this.service.notificationUnsubscribe(savedNotifSub);
          }
          this.service.unsubscribeContinuousVisulation({
            startDate: sol.startDate,
            endDate: sol.endDate,
            profile: sol.profile,
            version: sol.version
          })
        }
      })
  }

  getDetailedSchedule(schedule: Solution) {
    this.employeeAssignmentsMap = new Map()
    this.preferences = new Map()
    CacheUtils.setCurrentSchedule(schedule);
    this.service.getDetailedSolution(schedule).subscribe({
      next: (data: DetailedSchedule)=>{
        this.schedule = data;
        this.employeeSchedule = this.schedule.schedule
        if(this.schedule.schedule){
          this.startDate = new Date(this.schedule.schedule.startDate)
          this.endDate = new Date(this.schedule.schedule.endDate);
          this.nbColumns =
            DateUtils.nbDaysDifference(this.endDate, this.startDate);
            this.indexes = this.getIndexes();
          if(data.state === IN_PROGRESS){
            const obj: ContinuousVisualisationInterface = {
              startDate: this.schedule.startDate,
              endDate: this.schedule.endDate,
              profile: this.schedule.profile,
              version: this.schedule.version
            }
            this.service.subscribeContinuousVisulation(obj)
          }
          this.updateAssignments(this.schedule.schedule);
          if(data.state !== IN_PROGRESS){
            const savedPrefrences = CacheUtils.getPreferences(schedule);
            if(savedPrefrences){
              for(const pref of savedPrefrences){
                this.preferences.set(JSON.stringify({nurse: pref.username, shift: pref.shift, date: pref.date}), pref.preference)
              }
            }
          }
        }
        this.dataSource.data = data.previousVersions;
        this.validSchedule = true;
      },
      error: (err: HttpErrorResponse)=>{
        this.openErrorDialog(err.error)
      }
    })
  }

  updateAssignments(schedule:EmployeeSchedule){
    for (const sch of schedule.schedule) {
      this.employeeAssignmentsMap.set(sch.employee_name, sch.assignments);
      if(this.schedule.state !== IN_PROGRESS){
        for(const assignement of sch.assignments){
          //console.log(assignement.date)
          this.preferences.set(JSON.stringify({nurse: assignement.employee_name,
            shift: assignement.shift, date:assignement.date}),"");
        }
      }
    }
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
        return {'background-color': 'green', "height":"60px"};
      }
      else if(pref === "OFF"){
        return {'background-color': 'red', "height":"60px" };
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

  @HostListener("window:beforeunload")
  savePreferences(){
    const localPreferences: SchedulePreferenceElement[] = []
    for(const pref of this.preferences){
      if(pref[1]!== ""){
        const keyInterface = JSON.parse(pref[0]) as PreferenceKeyInterface
        const newPreference: SchedulePreferenceElement = {
          username: keyInterface.nurse,
          date: keyInterface.date,
          preference: pref[1],
          shift: keyInterface.shift,
          weight: "hard"
        }
        localPreferences.push(newPreference)
      }
    }
    const currentSchedule = CacheUtils.getCurrentSchedule();
    if(currentSchedule){
      CacheUtils.savePreferences(currentSchedule, localPreferences);
    }
  }

  viewSchedule(schedule: Solution){
    const localPreferences: SchedulePreferenceElement[] = []
    for(const pref of this.preferences){
      if(pref[1]!== ""){
        const keyInterface = JSON.parse(pref[0]) as PreferenceKeyInterface
        const newPreference: SchedulePreferenceElement = {
          username: keyInterface.nurse,
          date: keyInterface.date,
          preference: pref[1],
          shift: keyInterface.shift,
          weight: "hard"
        }
        localPreferences.push(newPreference)
      }
    }
    const currentSchedule = CacheUtils.getCurrentSchedule();
    if(currentSchedule){
      CacheUtils.savePreferences(currentSchedule, localPreferences);
    }

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
    for(const pref of this.preferences){
      if(pref[1]!== ""){
        const keyInterface = JSON.parse(pref[0]) as PreferenceKeyInterface
        const newPreference: SchedulePreferenceElement = {
          username: keyInterface.nurse,
          date: keyInterface.date,
          preference: pref[1],
          shift: keyInterface.shift,
          weight: "hard"
        }
        this.schedule.problem.preferences.push(newPreference)
      }
    }
    console.log(this.schedule.problem.preferences)
    this.service.regenerateSchedule(this.schedule.version, this.schedule.problem).subscribe({
      next: (sol: Solution)=> {
        const subscription: ContinuousVisualisationInterface = {
          startDate: sol.startDate,
          endDate: sol.endDate,
          profile: sol.profile,
          version: sol.version
        }
        CacheUtils.addNewNotifSubscription(subscription)
        this.service.notificationSubscribe(subscription);
        this.router.navigate(["/" + VIEW_SCHEDULES])
      },
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

  stopGeneration(){
    const obj: ContinuousVisualisationInterface = {
      startDate: this.schedule.startDate,
      endDate: this.schedule.endDate,
      profile: this.schedule.profile,
      version: this.schedule.version,
    }
    this.service.stopGeneration(obj).subscribe({
      error: (err: HttpErrorResponse)=>{
        if(err.status === HttpStatusCode.Ok){
          const currentSolution = CacheUtils.getCurrentSchedule();
          if(currentSolution){
            this.getDetailedSchedule(currentSolution)
          }
        }
        this.openErrorDialog(err.error)
      }
    })
  }
  exportSchedule(){
    const obj: ContinuousVisualisationInterface = {
      startDate: this.schedule.startDate,
      endDate: this.schedule.endDate,
      profile: this.schedule.profile,
      version: this.schedule.version,
    }
    this.service.exportSolution(obj).subscribe({
      next:(data:{content: string})=>{
        const file = new File([data.content], "schedule_" + CacheUtils.getProfile() + "_" + this.schedule.startDate + "_" + this.schedule.endDate + "_" + this.schedule.version + ".txt", {type:"text/plain;charset=utf-8"});
        saveAs(file);
      },
      error:(err: HttpErrorResponse)=>{
        this.openErrorDialog(err.error)
      }
    })
  }
}
