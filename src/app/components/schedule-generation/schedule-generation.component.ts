import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CONSULT_SCHEDULE } from "src/app/constants/app-routes";
import { ScheduleDataInterface } from "src/app/models/hospital-demand";
import { NurseInterface } from "src/app/models/Nurse";
import { NurseService } from "src/app/services/nurse/nurse.service";
import { ShiftService } from "src/app/services/shift/shift.service";
import { SkillService } from "src/app/services/shift/skill.service";
import { ErrorMessageDialogComponent } from "../error-message-dialog/error-message-dialog.component";

@Component({
  selector: "app-schedule-generation",
  templateUrl: "./schedule-generation.component.html",
  styleUrls: ["./schedule-generation.component.css"],
})
export class ScheduleGenerationComponent implements OnInit  {
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


  possibleShifts: string[];
  selectedShift: string;
  shifts: string[];


  scheduleData!: ScheduleDataInterface;

  
  constructor(private router: Router,private shiftService: ShiftService,private skillService: SkillService, 
    private nurseService: NurseService, private dialog: MatDialog
  ){
    this.startDate = new Date();

    this.endDate = new Date();

    this.problemNameFormCtrl = new FormControl(null, Validators.required);
    this.problemName = "";
    this.possibleNurses = [];
    this.selectedNurse = this.possibleNurses[0];
    this.nurses  = [];
    this.possibleShifts = [];
    this.selectedShift = this.possibleShifts[0];
    this.shifts = [];

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

      
      this.nurseService.getAllNurse().subscribe({
        next: (nurseGroups: NurseInterface[])=> {
          nurseGroups.forEach((nurseGroup: NurseInterface)=>{
            this.possibleNurses.push(nurseGroup);
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
  
  removeNurse(nurse: NurseInterface) {
    const index = this.nurses.indexOf(nurse);
    if (index > -1) {
      this.nurses.splice(index, 1);
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
    this.shifts.push(this.selectedShift);
    if (this.possibleShifts.length > 0) {
        this.selectedShift = this.possibleShifts[0];
    }
  }
  
  removeShift(shift: string) {
    const index = this.shifts.indexOf(shift);
    if (index > -1) {
      this.shifts.splice(index,1);
    }
    if (shift !== undefined && shift !== null) {
      this.possibleShifts.push(shift);
    }
  }


  updateStartDate(e: MatDatepickerInputEvent<Date>) {
    this.startDate =
      e.value != null && e.value != undefined
        ? (this.startDate = e.value)
        : (this.startDate = new Date());
  }

  updateEndDate(e: MatDatepickerInputEvent<Date>) {
    this.endDate =
      e.value != null && e.value != undefined
        ? (this.endDate = e.value)
        : (this.endDate = new Date());
  }


  viewSchedule() {
    this.router.navigate(["/" + CONSULT_SCHEDULE]);
  }
}
