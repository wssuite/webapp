import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
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
import { GenerationRequest, HospitalDemandElement, SchedulePreferenceElement } from "src/app/models/GenerationRequest";
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
    start: new FormControl(null, Validators.required),
    end: new FormControl(null, Validators.required),
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

  scheduleData!: ScheduleDataInterface;
  dateError: boolean

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
    this.demandsError = true;
    this.dateError = true;
  }
  ngOnInit(): void {
    try{
      this.shiftService.getShiftNames().subscribe({
        next: (shifts: string[])=>{
          shifts.forEach((shift: string)=>{
            this.possibleShifts.push(shift);
          })
          this.selectedShift=this.possibleShifts[0];
        },
        error: (error: HttpErrorResponse)=>{
          this.openErrorDialog(error.error);
        }
      })

      if(this.scheduleService.socket === undefined){
        this.scheduleService.connectSocket()
      }
      this.nurseService.getAllNurse().subscribe({
        next: (nurses: NurseInterface[])=> {
          nurses.forEach((nurse: NurseInterface)=>{
            this.possibleNurses.push(nurse);
            this.nursesUsername.push(nurse.username);
          })
          this.selectedNurse = this.possibleNurses[0];
        },
        error: (error: HttpErrorResponse)=> {
          this.openErrorDialog(error.error);
        }
      })

      try{
        this.skillService.getAllSkills().subscribe({
          next:(skills: string[])=>{
            skills.forEach((skill: string)=>{
              this.possibleSkills.push(skill);
            })
            this.selectedSkill = this.possibleSkills[0];
          },
          error: (error: HttpErrorResponse)=>{
            this.openErrorDialog(error.error);
          }
        })
  
      }catch(err){
        //Do nothing
      }

      
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
    }
  }

  
  addSkill() {
    const index = this.possibleSkills.indexOf(this.selectedSkill);
    if (index > -1) {
      this.possibleSkills.splice(index, 1);
    }
    this.skills = [...this.skills,this.selectedSkill];
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
    const dayDiffrences = Math.round((+this.endDate - +this.startDate)/DateUtils.dayMultiplicationFactor);
    console.log(dayDiffrences)
    this.dateError = dayDiffrences % 7 !== 0
    console.log(this.dateError)
  }

  generateSchedule(){
    const sd = DateUtils.arrangeDateString(this.startDate.toLocaleDateString().replaceAll("/", "-"))
    const ed = DateUtils.arrangeDateString(this.endDate.toLocaleDateString().replaceAll("/", "-"))
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
      hospitalDemand: this.hospitalDemands
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
    console.log(preferences);
    this.nursesPreference = preferences;
  }

  updateDemands(demand: HospitalDemandElement[]){
    this.hospitalDemands = demand;
  }

  updateDemandsErrorState(e: boolean){
    this.demandsError = e;
  }

}
