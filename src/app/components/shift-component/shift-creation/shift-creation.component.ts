import { Time } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ShiftInterface } from 'src/app/models/Shift';
import { Exception } from 'src/app/utils/Exception';

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
    this.nameShiftFormCtrl = new FormControl({value: this.shift.name, disabled: this.inputDisabled},
      Validators.required);
    this.startTimeFormCtrl = new FormControl({value: this.shift.startTime, disabled: false},
      Validators.required);
    this.endTimeFormCtrl = new FormControl({value: this.shift.name, disabled: false},
        Validators.required);
      this.shiftStartName = this.shift.name;
  }

  convertTime(time: string): Time{
    if (time === undefined || time === '') {
      throw new Exception("");
    }
    const timeArray = time.split(":")
    const hours = Number(timeArray[0]);
    const minutes = Number(timeArray[1]);
    
    return {hours,minutes};

  }

  setEndTime(){
    if (this.shift.startTime === undefined || this.shift.startTime === '') {
      return;
    }
    let endHours = 0;
    const startTime = this.convertTime(this.shift.startTime)
    endHours = startTime.hours+8;
    if(endHours > 24){
      endHours = endHours - 24
    }
    this.shift.endTime = (endHours.toString()+':'+startTime.minutes.toString());
  }

  emitShift(){
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


  onClearStartTime() {
    this.startTimeFormCtrl.setValue(null);
    this.onClearEndTime()
  }

  onClearEndTime() {
    this.endTimeFormCtrl.setValue(null);
    this.emitShift();
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