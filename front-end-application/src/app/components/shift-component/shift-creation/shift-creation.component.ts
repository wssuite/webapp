import { Time } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgxMaterialTimepickerComponent } from 'ngx-material-timepicker';
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
  @Input() imported: boolean



  nameShiftFormCtrl: FormControl;
  startTimeFormCtrl: FormControl;
  endTimeFormCtrl: FormControl;
  inputDisabled: boolean;
  shiftStartName!: string;


  constructor(){
    this.shiftChange = new EventEmitter();
    this.errorState = new EventEmitter();
    this.imported = false
    this.nameShiftFormCtrl = new FormControl(null, Validators.required);
    this.startTimeFormCtrl = new FormControl(null, Validators.required);
    this.endTimeFormCtrl = new FormControl(null, Validators.required);
    this.inputDisabled = false;
  }

  ngOnInit(): void {
    this.inputDisabled = this.shift.name === "" || this.imported? false: true;
    this.nameShiftFormCtrl = new FormControl({value: this.shift.name, disabled: this.inputDisabled},
      Validators.required);
    this.startTimeFormCtrl = new FormControl({value: this.shift.startTime, disabled: false},
      Validators.required);
    this.endTimeFormCtrl = new FormControl({value: this.shift.endTime, disabled: false},
        Validators.required);
      this.shiftStartName = this.shift.name;
      this.emitShift()
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

  changeEndTimeOnHover(){
    if (this.shift.endTime === undefined || this.shift.endTime === ''){
      this.setEndTime();
    }
  }

  setEndTime(){
    console.log("here")
    if (this.shift.startTime === undefined || this.shift.startTime === '') {
      return;
    }
    let endHours = 0;
    const startTime = this.convertTime(this.shift.startTime)
    endHours = startTime.hours+8;
    if(endHours > 24){
      endHours = endHours - 24
    }
    const endHoursString: string = endHours < 10? "0"+ endHours.toString(): endHours.toString()
    const endMinutesString: string = startTime.minutes < 10 ? "0"+ startTime.minutes.toString() : startTime.minutes.toString()
    this.shift.endTime = (endHoursString+':'+endMinutesString);
    this.emitShift()
  }

  emitShift(){
    const convertedTime= this.convertTime(this.shift.endTime)
    convertedTime.hours = convertedTime.hours === 24 ? 0: convertedTime.hours
    if(convertedTime.hours < 10) {
      const endHours = convertedTime.hours < 10? "0"+ convertedTime.hours.toString() : convertedTime.hours.toString()
      const endMinutes = convertedTime.minutes < 10? "0"+ convertedTime.minutes.toString() : convertedTime.minutes.toString()
      this.shift.endTime = `${endHours}:${endMinutes}`
    }
    this.shiftChange.emit(this.shift);
    this.emitErrorState();
  }

  emitErrorState() {
    this.errorState.emit(this.startTimeFormCtrl.hasError('required')||this.endTimeFormCtrl.hasError('required') || this.nameShiftFormCtrl.hasError('required') || (this.nameExist() && this.shiftStartName === '') );
    console.log("error");
  }

  nameExist(): boolean {
    const temp = [...this.shifts]
    if(this.imported){
      const index = temp.indexOf(this.shift.name)
      if(index > -1){
        temp.splice(index, 1)
      }
    }
    return temp.includes(this.shift.name);
  }


  onClearStartTime() {
    this.startTimeFormCtrl.setValue("");
    this.onClearEndTime()
  }

  onClearEndTime() {
    this.endTimeFormCtrl.setValue("");
    this.emitShift();
  }
  
  openFromIconStartTime(timepicker: NgxMaterialTimepickerComponent) {
    console.log("here open start time")
    if (!this.startTimeFormCtrl.disabled) {
      timepicker.open();
    }
    timepicker.timeChanged.subscribe((time: string)=>{
      console.log("time changed")
      this.shift.startTime = time
      this.setEndTime()
    })
  }

  openFromIconEndTime(timepicker: NgxMaterialTimepickerComponent) {
    if (!this.endTimeFormCtrl.disabled) {
      timepicker.open();
    }
  }



}