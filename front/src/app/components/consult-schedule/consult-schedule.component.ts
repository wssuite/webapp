import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
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
  nbColumns: number;
  nbHistoryColumns: number;
  indexes: number[] | undefined;
  isButtonDisabled: boolean[] | undefined;
  displayedColumns: string[];
  dataSource: MatTableDataSource<Solution>
  preferences: Map<string, string>
  inPrgressState = IN_PROGRESS
  nurses: NurseInterface[]
  profile: string
  version: string
  problemDefined: boolean
  employeesAssigned: boolean

  constructor(private service: ScheduleService, public dialog: MatDialog, private router: Router, private nurseService: NurseService) {
    this.historyAssignmentsMap = new Map();
    this.employeeAssignmentsMap = new Map();
    this.connectedUser = false;
    this.validSchedule = false;
    this.dataSource = new MatTableDataSource();
    this.displayedColumns = ["CreationDate","startDate", "endDate", "versionNumber", "state", "actions"]
    this.preferences = new Map();
    this.nurses = []
    this.nbColumns = 0
    this.nbHistoryColumns = 0;
    this.profile = ""
    this.version = ""
    this.problemDefined = true
    this.employeesAssigned = false
  }

  ngOnInit(): void {
    try{
      this.problemDefined = !this.service.importedScheduleToView
      if(this.problemDefined){
        this.nurseService.getAllNurse().subscribe({
          next: (nurses: NurseInterface[])=>{
            this.nurses = nurses
          },
          error: (err: HttpErrorResponse)=>{
            this.openErrorDialog(err.error);
          }
        })
      }
      this.connectedUser = true;
      const currentSchedule = this.service.selectedScheduleToView ?
          this.service.selectedScheduleToView : CacheUtils.getCurrentSchedule();
      if(currentSchedule){
        this.getDetailedSchedule(currentSchedule);
      } else {
        // const savedHistory = CacheUtils.getNurseHistory()
        // if(savedHistory){
        //   this.historyAssignmentsMap = new Map();
        //   this.setHistoryAssignments(savedHistory);
        // }
        this.openErrorDialog("No schedule has been found to be viewed")
      }
    }
    catch(err){
      // Do noting
    }
  }

  ngOnDestroy(): void {
    this.savePreferences()
    this.service.unsubscribeContinuousVisulation({
      startDate: this.schedule.startDate,
      endDate: this.schedule.endDate,
      profile: this.schedule.profile,
      version: this.schedule.version
    });
    this.service.socket.off(VISUALISATION_UPDATE);
    if(this.service.selectedScheduleToView && this.service.importedScheduleToView) {
      this.service.removeSolution(this.service.selectedScheduleToView)
    }
    this.profile = ""
    this.version = "";
  }

  ngAfterViewInit(): void {
    this.service.socket.on(VISUALISATION_UPDATE, (schedule: EmployeeSchedule)=>{
      // console.log("Receive "+VISUALISATION_UPDATE+": ", schedule);
      if(schedule) {
        this.employeeSchedule = schedule
        this.updateAssignments(schedule)
      }
    });
  }

  getDetailedSchedule(schedule: Solution) {
    this.historyAssignmentsMap = new Map();
    this.employeeAssignmentsMap = new Map()
    this.preferences = new Map()
    this.profile = schedule.profile
    this.version = schedule.version

    // listen to visualisation updates
    this.service.socket.once(NOTIFICATION_UPDATE, (sol: Solution)=>{
      if(this.profile === sol.profile && this.version === sol.version) {
        if(sol.state !== IN_PROGRESS) {
          this.service.notificationUnsubscribe({
            startDate: sol.startDate,
            endDate: sol.endDate,
            profile: sol.profile,
            version: sol.version
          });
        }
        this.getDetailedSchedule(sol);
      }
    });

    // fetch latest detailed solution
    CacheUtils.setCurrentSchedule(schedule);
    this.service.getDetailedSolution(schedule).subscribe({
      next: (data: DetailedSchedule)=>{
        this.schedule = data;
        this.employeeSchedule = this.schedule.schedule
        const schedStartDate = new Date(this.schedule.startDate)
        this.endDate = new Date(this.schedule.endDate);
        // update history startDate
        this.startDate = schedStartDate;
        this.problemDefined = Object.keys(this.schedule.problem).length > 0
        if(this.problemDefined) {
          for (const assignment of this.schedule.problem.history) {
            const d = new Date(assignment.date);
            if (d < this.startDate) {
              this.startDate = d;
            }
          }
        }
        this.nbColumns =
          DateUtils.nbDaysDifference(this.endDate, this.startDate);
        this.nbHistoryColumns = DateUtils.nbDaysDifference(schedStartDate, this.startDate) - 1;
        this.isButtonDisabled = this.getButtonDisabled();
        this.indexes = this.getIndexes();
        if(this.problemDefined) {
          const obj: ContinuousVisualisationInterface = {
            startDate: this.schedule.startDate,
            endDate: this.schedule.endDate,
            profile: this.schedule.profile,
            version: this.schedule.version
          }
          if(data.state === IN_PROGRESS){
            this.service.notificationSubscribe(obj)
            this.service.subscribeContinuousVisulation(obj)
          } else {
            this.service.notificationUnsubscribe(obj)
            this.service.unsubscribeContinuousVisulation(obj)
            const savedPrefrences = CacheUtils.getPreferences(schedule);
            if(savedPrefrences){
              for(const pref of savedPrefrences){
                this.preferences.set(JSON.stringify({nurse: pref.username, shift: pref.shift, date: pref.date}), pref.preference)
              }
            }
          }
          this.setHistoryAssignments(this.schedule.problem.history);
        }
        if(this.schedule.schedule){
          this.updateAssignments(this.schedule.schedule);
          if(!this.problemDefined) {
            this.updateNurses(this.schedule.schedule)
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

  setHistoryAssignments(history: NurseHistoryElement[]){
    for (const historyElement of history) {
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
      this.employeesAssigned = true
      this.employeeAssignmentsMap.set(sch.employee_uname, sch.assignments);
      for(const assignment of sch.assignments){
        this.preferences.set(JSON.stringify({nurse: assignment.employee_uname,
          shift: assignment.shift, date:assignment.date}),"");
      }
    }
  }

  updateNurses(schedule:EmployeeSchedule){
    this.nurses = []
    for (const sch of schedule.schedule) {
      for(const assignment of sch.assignments){
        const index = this.nurses.findIndex((nurse) => {
          return nurse.name === assignment.employee_uname
        })
        if (index === -1) {
          this.nurses.push({
            name: assignment.employee_uname,
            username: assignment.employee_uname,
            contracts: [],
            contract_groups: [],
            profile: this.profile
          })
        }
        break
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
    const disabled: boolean[] = [];
    let i = 0;
    for (; i < this.nbHistoryColumns; i++) {
      disabled.push(true);
    }
    for (; i < this.nbColumns; i++) {
      disabled.push(false);
    }
    return disabled;
  }

  getIndexes() {
    const indexes: number[] = [];
    for (let i = 0; i < this.nbColumns; i++) {
      indexes.push(i);
    }
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
    // fetch latest detailed schedule
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
      const config = CacheUtils.getGenerationConfig();
      if(config) {
        this.schedule.problem.config = config
      }
      this.service.regenerateSchedule(this.schedule.version, this.schedule.problem).subscribe({
        next:(sol: Solution)=> {
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

  nextSchedule() {
    const problemNurses: NurseInterface[] = []
    this.schedule.problem.nurses.forEach((username: string)=>{
      this.nurses.forEach((nurse: NurseInterface)=>{
        if(username === nurse.username){
          problemNurses.push(nurse)
        }
      })
    })

    const nextStart = new Date(this.schedule.problem.endDate.valueOf())
    DateUtils.addDays(nextStart, 1)
    const nDays = this.nbColumns - this.nbHistoryColumns - 1
    const nextEnd = new Date(nextStart.valueOf())
    DateUtils.addDays(nextEnd, nDays)
    const details : GenerationRequestDetails= {
      nurses: problemNurses,
      skills: this.schedule.problem.skills,
      shifts: this.schedule.problem.shifts,
      startDate: nextStart,
      endDate: nextEnd
    }
    CacheUtils.setGenerationRequest(details)

    const demand: HospitalDemandElement[][] = [];
    for (let d of this.schedule.problem.hospitalDemand) {
      while (demand.length <= d.index) {
        demand.push([])
      }
      const date = new Date(d.date)
      DateUtils.addDays(date, nDays)
      d.date = ""+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()
      demand[d.index].push(d);
    }
    CacheUtils.setDemandGenerationRequest(demand);

    const history: NurseHistoryElement[] = []
    for (const sch of this.schedule.schedule.schedule) {
      for(const assignment of sch.assignments){
        //console.log(assignment.date)
        history.push({
          username: assignment.employee_uname,
          shift: assignment.shift,
          date:assignment.date
        });
      }
    }
    CacheUtils.saveNurseHistory(history);

    this.router.navigate(["/" + SCHEDULE_GENERATION])
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
        if(err.statusText !== "OK") {
          this.openErrorDialog(err.error)
        }
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

  closeView(){
    this.router.navigate(["/" + VIEW_SCHEDULES])
  }
}
