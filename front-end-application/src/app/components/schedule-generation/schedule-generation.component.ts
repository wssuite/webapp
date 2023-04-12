import { HttpErrorResponse } from "@angular/common/http";
import { Component, HostListener, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { VIEW_SCHEDULES } from "src/app/constants/app-routes";
import { ScheduleDataInterface } from "src/app/models/hospital-demand"
import { NurseInterface } from "src/app/models/Nurse";
import { NurseService } from "src/app/services/nurse/nurse.service"
import { ShiftService } from "src/app/services/shift/shift.service";
import { SkillService } from "src/app/services/shift/skill.service";
import { ErrorMessageDialogComponent } from "../error-message-dialog/error-message-dialog.component";
import { GenerationRequest, GenerationRequestDetails, HospitalDemandElement, NurseHistoryElement, SchedulePreferenceElement } from "src/app/models/GenerationRequest";
import { DateUtils } from "src/app/utils/DateUtils";
import { CacheUtils } from "src/app/utils/CacheUtils";
import { ScheduleService } from "src/app/services/schedule/schedule-service.service";
import { ContinuousVisualisationInterface, Solution } from "src/app/models/Schedule";


@Component({
  selector: "app-schedule-generation",
  templateUrl: "./schedule-generation.component.html",
  styleUrls: ["./schedule-generation.component.css"],
})
export class ScheduleGenerationComponent implements OnInit {
  startDate: Date;
  endDate: Date;

  range = new FormGroup({
    start: new FormControl<Date>(new Date(), Validators.required),
    end: new FormControl<Date>(new Date(), Validators.required),
  });
  inputControlForm = new FormGroup({
    name: new FormControl(null, Validators.required),
  });


  problemNameFormCtrl: FormControl;
  problemName: string;
  possibleNurses: NurseInterface[];
  selectedNurse: NurseInterface;
  nurses:NurseInterface[];
  nursesUsername: string[];


  possibleShifts: string[];
  selectedShift: string;
  shifts: string[];

  selectSkillFormCtrl: FormControl;
  possibleSkills: string[];
  selectedSkill: string;
  skills: string[];

  hospitalDemands: HospitalDemandElement[];
  demandsError: boolean;
  nursesPreference: SchedulePreferenceElement[];
  nursesHistory: NurseHistoryElement[];

  scheduleData!: ScheduleDataInterface;
  dateError: boolean

  connectedUser: boolean

  constructor(private router: Router,private shiftService: ShiftService,private skillService: SkillService, 
    private nurseService: NurseService, private dialog: MatDialog, private scheduleService: ScheduleService
  ){
    this.startDate = new Date();
    this.endDate = new Date();
    this.possibleSkills = [];
    this.selectedSkill = this.possibleSkills[0];
    this.skills = [];
    this.selectSkillFormCtrl = new FormControl(null, Validators.required);

    this.problemNameFormCtrl = new FormControl(null, Validators.required);
    this.problemName = "";
    this.possibleNurses = [];
    this.selectedNurse = this.possibleNurses[0];
    this.nurses  = [];
    this.nursesUsername = [];
    this.possibleShifts = [];
    this.selectedShift = this.possibleShifts[0];
    this.shifts = [];
    this.hospitalDemands = [];
    this.nursesPreference = [];
    this.nursesHistory = [];
    this.demandsError = true;
    this.dateError = true;
    this.connectedUser = false;
  }
  ngOnInit(): void {
    this.nurses = []
    this.skills = []
    this.shifts = []
    this.nursesUsername = []
    try{
      const savedRequest = CacheUtils.getSavedGenerationRequest()
      console.log(savedRequest)
      if(savedRequest){
        this.startDate = new Date(savedRequest.startDate);
        this.endDate = new Date(savedRequest.endDate);
        this.range.get("start")?.setValue(this.startDate)
        this.range.get("end")?.setValue(this.endDate)
        const dayDiffrences = DateUtils.nbDaysDifference(this.endDate, this.startDate)
        console.log(dayDiffrences)
        this.dateError = dayDiffrences % 7 !== 0
      }
      this.shiftService.getShiftNames().subscribe({
        next: (shifts: string[])=>{
          this.possibleShifts= shifts
          this.selectedShift=this.possibleShifts[0];
          if(savedRequest){
            savedRequest.shifts.forEach((shift: string)=>{
              const index = this.possibleShifts.indexOf(shift)
              if(index > -1){
                this.possibleShifts.splice(index, 1)
                this.shifts.push(shift)
              }
            })
          }
        },
        error: (error: HttpErrorResponse)=>{
          this.openErrorDialog(error.error);
        }
      })
      this.nurseService.getAllNurse().subscribe({
        next: (nurses: NurseInterface[])=> {
          nurses.forEach((nurse: NurseInterface)=>{
            this.nursesUsername.push(nurse.username);
          })
          this.possibleNurses = nurses
          console.log(this.possibleNurses)
          this.selectedNurse = this.possibleNurses[0];
          if(savedRequest){
            savedRequest.nurses.forEach((nurse: NurseInterface)=>{
              this.possibleNurses.forEach((pn: NurseInterface)=>{
                if(pn.username === nurse.username){
                  console.log("here")
                  const index = this.possibleNurses.indexOf(pn)
                  if(index > -1){
                    this.possibleNurses.splice(index,1)
                    this.nurses.push(pn)
                  }
                }
              })
            })
          }
        },
        error: (error: HttpErrorResponse)=> {
          this.openErrorDialog(error.error);
        }
      })
      this.skillService.getAllSkills().subscribe({
        next:(skills: string[])=>{
          this.possibleSkills = skills
          this.selectedSkill = this.possibleSkills[0];
          if(savedRequest){
            savedRequest.skills.forEach((skill: string)=>{
              const index = this.possibleSkills.indexOf(skill)
              if(index > -1){
                this.possibleSkills.splice(index , 1)
                this.skills.push(skill)
              }
            })
          }
        },
        error: (error: HttpErrorResponse)=>{
          this.openErrorDialog(error.error);
        }
      })
      this.connectedUser = true

      console.log(this.nurses)
    }catch(err){
      //Do nothing
    }
  }

  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      data: {message: message},
    })
  }

  addAllNurse(){
    for(const nurse of this.possibleNurses){
      this.nurses = [...this.nurses,nurse];
    }
    this.possibleNurses = [];
  }

  addAllShift(){
    for(const shift of this.possibleShifts){
      this.shifts = [...this.shifts,shift];
    }
    this.possibleShifts = [];
  }

  addAllSkill(){
    for(const skill of this.possibleSkills){
      this.skills = [...this.skills,skill];
    }
    this.possibleSkills = [];
  }

  addAll(){
    this.addAllNurse();
    this.addAllShift();
    this.addAllSkill();
  }


  addNurse() {
    const index = this.possibleNurses.indexOf(this.selectedNurse);
    if (index > -1) {
      this.possibleNurses.splice(index, 1);
    }
    this.nurses = [...this.nurses,this.selectedNurse];
    if (this.possibleNurses.length > 0) {
        this.selectedNurse = this.possibleNurses[0];
    }
  }
  
  removeNurse(nurse: NurseInterface) {
    const index = this.nurses.indexOf(nurse);
    if (index > -1) {
      this.nurses.splice(index, 1);
      this.nurses = [...this.nurses];
    }
    if (nurse !== undefined && nurse !== null) {
      this.possibleNurses.push(nurse);
      this.selectedNurse = this.possibleNurses[0]
    }
  }

  addShift() {
    const index = this.possibleShifts.indexOf(this.selectedShift);
    if (index > -1) {
      this.possibleShifts.splice(index, 1);
    }
    this.shifts = [...this.shifts,this.selectedShift]
    if (this.possibleShifts.length > 0) {
        this.selectedShift = this.possibleShifts[0];
    }
  }
  
  removeShift(shift: string) {
    const index = this.shifts.indexOf(shift);
    if (index > -1) {
      this.shifts.splice(index,1);
      this.shifts = [...this.shifts];
    }
    if (shift !== undefined && shift !== null) {
      this.possibleShifts.push(shift);
      this.selectedShift = this.possibleShifts[0];
    }
  }

  
  addSkill() {
    console.log(this.possibleSkills);
    console.log(this.selectedSkill);
    console.log(this.skills)
    const index = this.possibleSkills.indexOf(this.selectedSkill);
    if (index > -1) {
      this.possibleSkills.splice(index, 1);
      console.log("allo")
    }
    this.skills = [...this.skills,this.selectedSkill];
    console.log(this.skills);
    if (this.possibleSkills.length > 0) {
        this.selectedSkill = this.possibleSkills[0];
    }
  }
  
  removeSkill(skill: string) {
    const index = this.skills.indexOf(skill);
    if (index > -1) {
      this.skills.splice(index,1);
      this.skills = [...this.skills];
    if (skill !== undefined && skill !== null) {
      this.possibleSkills.push(skill);
      this.selectedSkill = this.possibleSkills[0];
    }
  }
}


  updateStartDate(e: MatDatepickerInputEvent<Date>) {
    this.startDate =
      e.value != null && e.value != undefined
        ? (this.startDate = e.value)
        : (this.startDate = new Date());
    //this.endDate = new Date(+this.startDate + (7 * DateUtils.dayMultiplicationFactor))
  }

  updateEndDate(e: MatDatepickerInputEvent<Date>) {
    this.endDate =
      e.value != null && e.value != undefined
        ? (this.endDate = e.value)
        : (this.endDate = new Date());
    const dayDiffrences = DateUtils.nbDaysDifference(this.endDate, this.startDate)
    console.log(dayDiffrences)
    this.dateError = dayDiffrences % 7 !== 0
    console.log(this.dateError)
  }

  generateSchedule(){
    const sd = DateUtils.arrangeDateString(this.startDate.toISOString().split("T")[0])
    const ed = DateUtils.arrangeDateString(this.endDate.toISOString().split("T")[0])
    const requestNurses: string[] = []
    this.nurses.forEach((nurse: NurseInterface)=>{
      requestNurses.push(nurse.username)
    })
    const request: GenerationRequest= {
      startDate: sd,
      endDate: ed,
      profile: CacheUtils.getProfile(),
      preferences: this.nursesPreference,
      nurses: requestNurses,
      skills: this.skills,
      shifts: this.shifts,
      hospitalDemand: this.hospitalDemands,
      history: this.nursesHistory,
    }
    this.scheduleService.generateSchedule(request).subscribe({
      next: (sol: Solution)=>{
        const subscription: ContinuousVisualisationInterface = {
          startDate: sol.startDate,
          endDate: sol.endDate,
          profile: sol.profile,
          version: sol.version
        }
        CacheUtils.addNewNotifSubscription(subscription)
        this.scheduleService.notificationSubscribe(subscription);
        this.router.navigate(["/" + VIEW_SCHEDULES])
      },
      error: (err: HttpErrorResponse)=>{
        this.openErrorDialog(err.error);
      }
      
    })
  }


  updatePreferences(preferences: SchedulePreferenceElement[]) {
    this.nursesPreference = preferences;
  }

  updateDemand(demand: HospitalDemandElement[]){
    this.hospitalDemands = demand;
  }
  
  updateHistory(history: NurseHistoryElement[]){
    this.nursesHistory = history;
  }

  updateDemandsErrorState(e: boolean){
    this.demandsError = e;
  }

  @HostListener("window:beforeunload")
  saveDetails(){
    console.log(this.nurses)
    const request : GenerationRequestDetails ={
      startDate: this.startDate,
      endDate: this.endDate,
      nurses: this.nurses,
      shifts: this.shifts,
      skills: this.skills
    }
    CacheUtils.setGenerationRequest(request)
  }
}
