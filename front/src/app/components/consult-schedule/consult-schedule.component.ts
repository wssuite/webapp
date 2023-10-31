import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import * as saveAs from "file-saver";
import {MAIN_MENU, SCHEDULE_GENERATION, VIEW_SCHEDULES} from "src/app/constants/app-routes";
import { Assignment, EmployeeSchedule } from "src/app/models/Assignment";
import { GenerationRequestDetails, SchedulePreferenceElement, NurseHistoryElement, HospitalDemandElement } from "src/app/models/GenerationRequest";
import { ContinuousVisualisationInterface, DetailedSchedule, Solution } from "src/app/models/Schedule";
import { ScheduleService } from "src/app/services/schedule/schedule-service.service";
import { CacheUtils } from "src/app/utils/CacheUtils";
import { DateUtils } from "src/app/utils/DateUtils";
import { ErrorMessageDialogComponent } from "../error-message-dialog/error-message-dialog.component";
import { IN_PROGRESS, WAITING } from "src/app/constants/schedule_states";
import { NOTIFICATION_UPDATE, VISUALISATION_UPDATE } from "src/app/constants/socket-events";
import { ReportDialogComponent } from "../report-dialog/report-dialog.component";
import { NurseInterface } from "src/app/models/Nurse";
import { NurseService } from "src/app/services/nurse/nurse.service";

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
  historyAssignmentsMap: Map<string, NurseHistoryElement[]>;
  endDate: Date | undefined;
  startDate: Date | undefined;
  validSchedule: boolean;
  nbColumns: number | undefined;
  nbHistoryColumns: number;
  indexes: number[] | undefined;
  isButtonDisabled: boolean[] | undefined;
  displayedColumns: string[];
  dataSource: MatTableDataSource<Solution>
  preferences: Map<string, string>
  inPrgressState = IN_PROGRESS
  nurses: NurseInterface[]

  constructor(private service: ScheduleService, public dialog: MatDialog, private router: Router, private nurseService: NurseService) {
    this.historyAssignmentsMap = new Map();
    this.employeeAssignmentsMap = new Map();
    this.connectedUser = false;
    this.validSchedule = false;
    this.dataSource = new MatTableDataSource();
    this.displayedColumns = ["CreationDate","startDate", "endDate", "versionNumber", "state", "actions"]
    this.preferences = new Map();
    this.nurses = []
    this.nbHistoryColumns = 0;
  }

  ngOnInit(): void {
    try{
      this.nurseService.getAllNurse().subscribe({
        next: (nurses: NurseInterface[])=>{
          this.nurses = nurses
        },
        error: (err: HttpErrorResponse)=>{
          this.openErrorDialog(err.error);
        }
      })
      const currentSchedule = this.service.selectedScheduleToView ?
          this.service.selectedScheduleToView : CacheUtils.getCurrentSchedule();
      if(currentSchedule){
        this.getDetailedSchedule(currentSchedule);
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
          console.log(this.schedule.startDate)
          console.log(this.schedule.endDate)
          const schedStartDate = new Date(this.schedule.startDate)
          this.endDate = new Date(this.schedule.endDate);
          // update history startDate
          this.startDate = schedStartDate;
          for (const assignment of this.schedule.problem.history) {
            const d = new Date(assignment.date);
            if (d < this.startDate) {
              this.startDate = d;
            }
          }
          this.nbColumns =
            DateUtils.nbDaysDifference(this.endDate, this.startDate);
          this.nbHistoryColumns = DateUtils.nbDaysDifference(schedStartDate, this.startDate) - 1;
          this.isButtonDisabled = this.getButtonDisabled();
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
          this.setHistoryAssignments();
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

  setHistoryAssignments(){
    this.historyAssignmentsMap = new Map();
    for (const historyElement of this.schedule.problem.history) {
      let elements = this.historyAssignmentsMap.get(historyElement.username)
      if(elements === undefined) {
        this.historyAssignmentsMap.set(historyElement.username, [historyElement]);
      } else {
        elements.push(historyElement);
      }
    }
  }

  updateAssignments(schedule:EmployeeSchedule){
    for (const sch of schedule.schedule) {
      this.employeeAssignmentsMap.set(sch.employee_uname, sch.assignments);
      if(this.schedule.state !== IN_PROGRESS){
        for(const assignment of sch.assignments){
          //console.log(assignment.date)
          this.preferences.set(JSON.stringify({nurse: assignment.employee_uname,
            shift: assignment.shift, date:assignment.date}),"");
        }
      }
    }
  }

  openErrorDialog(message: string){
    this.dialog.open(ErrorMessageDialogComponent, {
      height: '45%',
      width: '45%',
      position: {top:'20vh',left: '30%', right: '25%'},
      data: {message: message}
    })
  }

  getDateDayStringByIndex(index: number): string {
    if (this.startDate == undefined) {
      return "";
    }
    const nextDay = new Date(
      +this.startDate + (index) * DateUtils.dayMultiplicationFactor
    );
    const local_string = nextDay.toISOString().split("T")[0];
    return DateUtils.arrangeDateString(local_string);
  }

  getDisplayedDate(date: string){
    try{
      const dateSplitted = date.split("-")
      return `${dateSplitted[1]}/${dateSplitted[2]}`
    }catch(err){
      return ""
    }
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

  getButtonDisabled() {
    const diabled: boolean[] = [];
    if (this.nbColumns == undefined || this.nbHistoryColumns == undefined) {
      return [];
    }
    let i = 0;
    for (; i < this.nbHistoryColumns; i++) {
      diabled.push(true);
    }
    for (; i < this.nbColumns; i++) {
      diabled.push(false);
    }
    console.log(diabled.length)
    return diabled;
  }

  getIndexes() {
    const indexes: number[] = [];
    if (this.nbColumns == undefined) {
      return [];
    }
    for (let i = 0; i < this.nbColumns; i++) {
      indexes.push(i);
    }
    console.log(indexes.length)
    return indexes;
  }

  getEmployeeShift(employeeName: string, index: number): string {
    let ret = "";
    let assignments;
    if (index < this.nbHistoryColumns) {
      assignments = this.historyAssignmentsMap.get(employeeName);
    } else {
      assignments = this.employeeAssignmentsMap.get(employeeName);
    }
    if (assignments === undefined || assignments === null) {
      return ret;
    }
    const date = this.getDateDayStringByIndex(index);
    for (const assignment of assignments) {
      if (assignment.date === date) {
        ret = assignment.shift.toUpperCase();
        break;
      }
    }
    return ret;
  }

  getEmployeeSkill(employeeName: string, index: number): string {
    let ret = "";
    if(index < this.nbHistoryColumns) {
      return ret;
    }
    const assignments = this.employeeAssignmentsMap.get(employeeName);
    if (assignments === undefined || assignments === null) {
      return ret;
    }
    const date = this.getDateDayStringByIndex(index);
    for (const assignment of assignments) {
      if (assignment.date === date) {
        ret = assignment.skill ;
        break;
      }
    }
    return ret;
  }

  getPreference(name: string, index: number): string|undefined{
    if(index < this.nbHistoryColumns) {
      return "HIST";
    }
    const assignments = this.employeeAssignmentsMap.get(name);
    //console.log(assignments === undefined)
    if(assignments === undefined){
      return undefined
    }
    const date = this.getDateDayStringByIndex(index);
    let shift = "";
    for(const assignment of assignments){
      if(assignment.date === date) {
        shift = assignment.shift;
        break;
      }
    }
    const key = JSON.stringify({nurse: name,
      shift: shift,
      date: date})
    return this.preferences.get(key)
  }

  getHeaderStyle(index: number) {
    if (index < this.nbHistoryColumns) {
      return {'background-color': '#ffa500'};
    } else {
      return {'background-color': '#255792'};
    }
  }

  getButtonStyle(name: string, index: number){
    const pref = this.getPreference(name, index);
    if(pref !== undefined){
      if(pref === "ON"){
        return {'background-color': 'rgba(76, 175, 80, 0.2)', "height":"60px"};
      }
      else if(pref === "OFF"){
        return {'background-color': 'rgba(227, 50, 39, 0.2)', "height":"60px" };
      }
      else if(pref === "HIST"){
        return {'background-color': 'rgba(255, 165, 0, 0.2)', "height":"60px" };
      }
      return { 'background-color': 'rgb(235, 234, 234)', "height":"60px" };
    }
    return { 'background-color': 'rgb(235, 234, 234)' , "height":"60px"};
  }

  updatePreference(name: string, index: number): void {
    if(index < this.nbHistoryColumns) {
      return undefined
    }
    const date = this.getDateDayStringByIndex(index);
    const assignments = this.employeeAssignmentsMap.get(name);
    //console.log(assignments === undefined)
    if(assignments === undefined){
      return undefined
    }
    let shift = "";
    for(const assignment of assignments){
      if(assignment.date === date) {
        shift = assignment.shift;
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

  exportProblem(schedule: Solution, format: string = "txt") {
    this.exportThisProblem(schedule.version, schedule.startDate, schedule.endDate, format)
  }

  exportCurrentScheduleProblem(format: string = "txt") {
    this.exportThisProblem(this.schedule.version, this.schedule.startDate, this.schedule.endDate, format)
  }

  exportThisProblem(version: string, startDate: string, endDate: string, format: string) {
    this.service.exportProblem(version, startDate, endDate, format).subscribe({
      next: (data: {content: string})=>{
        const file = new File([data.content], CacheUtils.getProfile() + "_" + startDate + "_" + endDate + "_" + version + "." + format, {type:"text/plain;charset=utf-8"});
        saveAs(file);
      }
    })
  }

  exportError(){
    const solution: ContinuousVisualisationInterface = {
      startDate: this.schedule.startDate,
      endDate: this.schedule.endDate,
      version: this.schedule.version,
      profile: this.schedule.profile
    }
    this.service.exportError(solution).subscribe({
      next: (data: {content: string})=>{
        const file = new File([data.content], CacheUtils.getProfile() + "_" + this.schedule.startDate + "_" + this.schedule.endDate + "_" + this.schedule.version + "error.txt", {type:"text/plain;charset=utf-8"});
        saveAs(file);
      }
    })
  }

  regenerateSchedule(showDetails: boolean) {
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
    if(showDetails){
      const problemNurses: NurseInterface[] = []
      this.schedule.problem.nurses.forEach((username: string)=>{
        this.nurses.forEach((nurse: NurseInterface)=>{
          if(username === nurse.username){
            problemNurses.push(nurse)
          }
        })
      })
      const details : GenerationRequestDetails= {
        nurses: problemNurses,
        skills: this.schedule.problem.skills,
        shifts: this.schedule.problem.shifts,
        startDate: new Date(this.schedule.problem.startDate),
        endDate: new Date(this.schedule.problem.endDate)
      }

      CacheUtils.setGenerationRequest(details)
      CacheUtils.setGenerationRequestPreferences(this.schedule.problem.preferences)
      const demand: HospitalDemandElement[][] = [];
      for (let d of this.schedule.problem.hospitalDemand) {
        while (demand.length <= d.index) {
          demand.push([])
        }
        demand[d.index].push(d);
      }
      CacheUtils.setDemandGenerationRequest(demand);
      CacheUtils.saveNurseHistory(this.schedule.problem.history);
      CacheUtils.setOldVersion(this.schedule.version)
      this.router.navigate(["/" + SCHEDULE_GENERATION])
    }
    else{
      this.service.regenerateSchedule(this.schedule.version, this.schedule.problem).subscribe({
        next:(sol: Solution)=> {
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
  viewReport(){
    this.dialog.open(ReportDialogComponent, {
      data: {startDate: this.schedule.startDate,
        endDate: this.schedule.endDate,
        profile: this.schedule.profile,
        version: this.schedule.version,},
        height: '60%',
        width: '55%',
        position: {top:'8vh',left: '25%', right: '25%'},
    })
  }
}