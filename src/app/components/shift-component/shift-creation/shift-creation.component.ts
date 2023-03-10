import { Time } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ShiftInterface } from 'src/app/models/Shift';

@Component({
  selector: 'app-shift-creation',
  templateUrl: './shift-creation.component.html',
  styleUrls: ['./shift-creation.component.css']
})
export class ShiftCreationComponent implements OnInit{
  @Input() shift!: ShiftInterface;
  @Output() shiftChange: EventEmitter<ShiftInterface>;
  @Output() errorState: EventEmitter<boolean>;
  @Input() shifts!: string[]



  nameShiftFormCtrl: FormControl;
  startTimeFormCtrl: FormControl;
  endTimeFormCtrl: FormControl;
  inputDisabled: boolean;
  shiftStartName!: string;


  constructor(){
    this.shiftChange = new EventEmitter();
    this.errorState = new EventEmitter();
 
    this.nameShiftFormCtrl = new FormControl(null, Validators.required);
    this.startTimeFormCtrl = new FormControl(null, Validators.required);
    this.endTimeFormCtrl = new FormControl(null, Validators.required);
    this.inputDisabled = false;
  }

  ngOnInit(): void {
    this.inputDisabled = this.shift.name === ""? false: true;
    this.inputDisabled = this.shift.startTime === ""? false: true;
    this.inputDisabled = this.shift.endTime === ""? false: true;
    this.nameShiftFormCtrl = new FormControl({value: this.shift.name, disabled: this.inputDisabled},
      Validators.required);
    this.startTimeFormCtrl = new FormControl({value: this.shift.startTime, disabled: this.inputDisabled},
      Validators.required);
    this.endTimeFormCtrl = new FormControl({value: this.shift.name, disabled: this.inputDisabled},
        Validators.required);
      this.shiftStartName = this.shift.name;
  }

  convertTime(time: string): Time{
    let hours = Number(time.match(/^(\d+)/)![1]);
    let minutes = Number(time.match(/:(\d+)/)![1]);

    return {hours,minutes};

  }

  setEndTime(time: string){
    let endHours = 0;
    let endAMPM = "";
    let startTime = this.convertTime(time)
    let AMPM = time.match(/\s(.*)$/)![1];

    if(AMPM == "PM"){
      if (startTime.hours<12) startTime.hours = startTime.hours+12;
      endHours = startTime.hours+8;
      if (endHours > 24){
        endHours - 24;
        endAMPM = "AM"
      }
    }
    if(AMPM == "AM") {
      if (startTime.hours==12) startTime.hours = startTime.hours-12;
      endHours = startTime.hours+8;
      if (endHours > 12){
        endHours - 12;
        endAMPM = "PM"
      }
      }
    this.shift.endTime = (endHours.toString()+':'+startTime.minutes.toString()+' '+endAMPM);
  }

  emitShift(){
    console.log("leave")
    this.shiftChange.emit(this.shift);
    this.emitErrorState();
  }

  emitErrorState() {
    this.errorState.emit(this.startTimeFormCtrl.hasError('required')||this.endTimeFormCtrl.hasError('required') || this.nameShiftFormCtrl.hasError('required') || (this.nameExist() && this.shiftStartName === '') );
    console.log("error");
  }

  nameExist(): boolean {
    return this.shifts.includes(this.shift.name);
  }


  onClearStartTime($event: Event) {
    this.startTimeFormCtrl.setValue(null);
  }

  onClearEndTime($event: Event) {
    this.endTimeFormCtrl.setValue(null);
  }
  
  openFromIconStartTime(timepicker: { open: () => void }) {
    if (!this.startTimeFormCtrl.disabled) {
      timepicker.open();
    }
  }

  openFromIconEndTime(timepicker: { open: () => void }) {
    if (!this.endTimeFormCtrl.disabled) {
      timepicker.open();
    }
  }



}