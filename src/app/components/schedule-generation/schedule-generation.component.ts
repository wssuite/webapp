import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CONSULT_SCHEDULE } from "src/app/constants/app-routes";
import { ScheduleDataInterface } from "src/app/models/hospital-demand";
import { NurseInterface } from "src/app/models/Nurse";
import { ContractService } from "src/app/services/contract/contract.service";
import { NurseGroupService } from "src/app/services/nurse/nurse-group.service";
import { NurseService } from "src/app/services/nurse/nurse.service";
import { ShiftGroupService } from "src/app/services/shift/shift-group.service";
import { ShiftTypeService } from "src/app/services/shift/shift-type.service";
import { ShiftService } from "src/app/services/shift/shift.service";
import { SkillService } from "src/app/services/shift/skill.service";
import { ErrorMessageDialogComponent } from "../error-message-dialog/error-message-dialog.component";

@Component({
  selector: "app-schedule-generation",
  templateUrl: "./schedule-generation.component.html",
  styleUrls: ["./schedule-generation.component.css"],
})
export class ScheduleGenerationComponent implements OnInit  {

  range = new FormGroup({
    start: new FormControl(null, Validators.required),
    end: new FormControl(null, Validators.required),
  });
  inputControlForm = new FormGroup({
    name: new FormControl(null, Validators.required),
  });


  problemNameFormCtrl: FormControl;
  problemName: string;

  possibleNurses: string[];
  selectedNurse: string;
  nurses:string[];


  possibleNurseGroups: string[];
  selectedNurseGroup: string;
  nurseGroups: string[];

  possibleSkills: string[];
  selectedSkill: string;


  possibleShifts: string[];
  selectedShift: string;
  shifts: string[];

  possibleShiftTypes: string[];
  selectedShiftType: string;
  shiftTypes: string[];

  possibleShiftGroups: string[];
  selectedShiftGroup: string;
  shiftGroups: string[];

  scheduleData!: ScheduleDataInterface;


  
  constructor(private router: Router, private service: ContractService, private shiftGroupService: ShiftGroupService,
    private shiftService: ShiftService, private shiftTypeService: ShiftTypeService, private skillService: SkillService, 
    private nurseService: NurseService, private nurseGroupService: NurseGroupService,private dialog: MatDialog
  ){
    this.problemNameFormCtrl = new FormControl(null, Validators.required);
    this.problemName = "";
    this.possibleNurses = [];
    this.selectedNurse = "";
    this.nurses = [];
    this.possibleSkills = [];
    this.selectedSkill = "";
    this.possibleShifts = [];
    this.selectedShift = "";
    this.shifts = [];
    this.possibleShiftTypes = [];
    this.selectedShiftType = "";
    this.shiftTypes = [];
    this.possibleShiftGroups = [];
    this.selectedShiftGroup="";
    this.shiftGroups = [];
    this.possibleNurseGroups = [];
    this.selectedNurseGroup = "";
    this.nurseGroups = [];
  }
  ngOnInit(): void {
    try{
      this.shiftService.getShiftNames().subscribe({
        next: (shifts: string[])=>{
          shifts.forEach((shift: string)=>{
            this.possibleShifts.push(shift);
          })
        },
        error: (error: HttpErrorResponse)=>{
          this.openErrorDialog(error.error);
        }
      })

      this.shiftTypeService.getShiftTypeNames().subscribe({
        next: (shifts: string[])=>{
          shifts.forEach((shift: string)=>{
            this.possibleShifts.push(shift);
          })
        },
        error: (error: HttpErrorResponse)=>{
          this.openErrorDialog(error.error);
        }
      })

      this.shiftGroupService.getShiftGroupNames().subscribe({
        next: (shifts: string[])=>{
          shifts.forEach((shift: string)=>{
            this.possibleShifts.push(shift);
          })
        },
        error: (error: HttpErrorResponse)=>{
          this.openErrorDialog(error.error);
        }
      })

      this.skillService.getAllSkills().subscribe({
        next:(skills: string[])=>{
          skills.forEach((skill: string)=>{
            this.possibleSkills.push(skill);
          })
        },
        error: (error: HttpErrorResponse)=>{
          this.openErrorDialog(error.error);
        }
      })

      
      this.nurseService.getAllNurse().subscribe({
        next: (nurseGroups: NurseInterface[])=> {
          nurseGroups.forEach((nurseGroup: NurseInterface)=>{
            this.possibleNurses.push(nurseGroup.name);
          })
        },
        error: (error: HttpErrorResponse)=> {
          this.openErrorDialog(error.error);
        }
      })

      this.nurseGroupService.getAllNurseGroup().subscribe({
        next: (nurseGroups: string[])=> {
          nurseGroups.forEach((nurseGroup: string)=>{
            this.possibleNurseGroups.push(nurseGroup);
          })
        },
        error: (error: HttpErrorResponse)=> {
          this.openErrorDialog(error.error);
        }
      })
      
    }catch(err){
      //Do nothing
    }
  }

  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      data: {message: message},
    })
  }


  addNurse() {
    const index = this.possibleNurses.indexOf(this.selectedNurse);
    if (index > -1) {
      this.possibleNurses.splice(index, 1);
    }
    this.nurses.push(this.selectedNurse);
    if (this.possibleNurses.length > 0) {
        this.selectedNurse = this.possibleNurses[0];
    }
  }
  
  removeNurse(nurse: string) {
    const index = this.nurses.indexOf(nurse);
    if (index > -1) {
      this.nurses.splice(index, 1);
    }
    if (nurse !== undefined && nurse !== null) {
      this.possibleNurses.push(nurse);
    }
  }

  addNurseGroup() {
    const index = this.possibleNurseGroups.indexOf(this.selectedNurseGroup);
    if (index > -1) {
      this.possibleNurseGroups.splice(index, 1);
    }
    this.nurseGroups.push(this.selectedNurseGroup);
    if (this.possibleNurseGroups.length > 0) {
        this.selectedNurseGroup = this.possibleNurseGroups[0];
    }
  }
  
  removeNurseGroup(nurseGroup: string) {
    const index = this.nurseGroups.indexOf(nurseGroup);
    if (index > -1) {
      this.nurseGroups.splice(index, 1);
    }
    if (nurseGroup !== undefined && nurseGroup !== null) {
      this.possibleNurseGroups.push(nurseGroup);
    }
  }

  addShift() {
    const index = this.possibleShifts.indexOf(this.selectedShift);
    if (index > -1) {
      this.possibleShifts.splice(index, 1);
    }
    this.scheduleData.shifts.push(this.selectedShift);
    this.shifts.push(this.selectedShift);
    if (this.possibleShifts.length > 0) {
        this.selectedShift = this.possibleShifts[0];
    }
  }
  
  removeShift(shift: string) {
    const index = this.scheduleData.shifts.indexOf(shift);
    if (index > -1) {
      this.scheduleData.shifts.splice(index, 1);
      this.shifts.splice(index,1);
    }
    if (shift !== undefined && shift !== null) {
      this.possibleShifts.push(shift);
    }
  }

  addShiftType() {
    const index = this.possibleShiftTypes.indexOf(this.selectedShiftType);
    if (index > -1) {
      this.possibleShiftTypes.splice(index, 1);
    }
    this.scheduleData.shifts.push(this.selectedShiftType);
    this.shiftTypes.push(this.selectedShiftType);
    if (this.possibleShiftTypes.length > 0) {
        this.selectedShiftType = this.possibleShiftTypes[0];
    }
  }
  
  removeShiftType(shiftType: string) {
    const index = this.scheduleData.shifts.indexOf(shiftType);
    if (index > -1) {
      this.scheduleData.shifts.splice(index, 1);
      this.shiftTypes.splice(index,1);
    }
    if (shiftType !== undefined && shiftType !== null) {
      this.possibleShiftTypes.push(shiftType);
    }
  }

  addShiftGroup() {
    const index = this.possibleShiftGroups.indexOf(this.selectedShiftGroup);
    if (index > -1) {
      this.possibleShiftGroups.splice(index, 1);
    }
    this.scheduleData.shifts.push(this.selectedShiftGroup);
    this.shiftGroups.push(this.selectedShiftGroup);
    if (this.possibleShiftGroups.length > 0) {
        this.selectedShiftGroup = this.possibleShiftGroups[0];
    }
  }
  
  removeShiftGroup(shiftGroup: string) {
    const index = this.scheduleData.shifts.indexOf(shiftGroup);
    if (index > -1) {
      this.scheduleData.shifts.splice(index, 1);
      this.shiftGroups.push(this.selectedShiftGroup);
    }
    if (shiftGroup !== undefined && shiftGroup !== null) {
      this.possibleShifts.push(shiftGroup);
    }
  }

  addSkill() {
    const index = this.possibleSkills.indexOf(this.selectedSkill);
    if (index > -1) {
      this.possibleSkills.splice(index, 1);
    }
    this.scheduleData.skills.push(this.selectedSkill);
    if (this.possibleSkills.length > 0) {
        this.selectedSkill = this.possibleSkills[0];
    }
  }
  
  removeSkill(skill: string) {
    const index = this.scheduleData.skills.indexOf(skill);
    if (index > -1) {
      this.scheduleData.skills.splice(index, 1);
    }
    if (skill !== undefined && skill !== null) {
      this.possibleSkills.push(skill);
    }
  }


  updateStartDate(e: MatDatepickerInputEvent<Date>) {
    this.scheduleData.startDate =
      e.value != null && e.value != undefined
        ? (this.scheduleData.startDate = e.value)
        : (this.scheduleData.startDate = new Date());
  }

  updateEndDate(e: MatDatepickerInputEvent<Date>) {
    this.scheduleData.endDate =
      e.value != null && e.value != undefined
        ? (this.scheduleData.endDate = e.value)
        : (this.scheduleData.endDate = new Date());
  }


  viewSchedule() {
    this.router.navigate(["/" + CONSULT_SCHEDULE]);
  }
}
