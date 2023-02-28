import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MinMaxShiftConstraint } from 'src/app/models/MinMaxShiftConstraint';

@Component({
  selector: 'app-min-max-consecutive-shift',
  templateUrl: './min-max-consecutive-shift.component.html',
  styleUrls: ['./min-max-consecutive-shift.component.css']
})
export class MinMaxConsecutiveShiftComponent {

  @Input() constraint!: MinMaxShiftConstraint;
  @Output() constraintChange: EventEmitter<MinMaxShiftConstraint>;
  @Input() possibleShifts!: string[];
  @Output() errorState: EventEmitter<boolean>;
  minValueErrorState: boolean;
  maxValueErrorState: boolean;
  maxWeightErrorState: boolean;
  minWeightErrorState: boolean;
  selectFormCtrl: FormControl;
  minWeightLabel: string;
  maxWeightLabel: string;

  constructor() {
    this.constraintChange = new EventEmitter();
    this.errorState = new EventEmitter();
    this.minValueErrorState = true;
    this.maxValueErrorState = true;
    this.maxWeightErrorState = true;
    this.minWeightErrorState = true;
    this.selectFormCtrl = new FormControl(null, Validators.required);
    this.maxWeightLabel = " Max weight";
    this.minWeightLabel = "Min weight"
  }

  emitErrorState(){
    this.errorState.emit(this.minValueErrorState || this.maxValueErrorState ||
          this.minWeightErrorState || this.maxWeightErrorState ||
          this.selectFormCtrl.hasError('required'));
  }

  emitConstraint() {
    this.constraintChange.emit(this.constraint);
    this.emitErrorState();
  }

  updateMinValueErrorState(e: boolean) {
    this.minValueErrorState = e;
    this.emitConstraint();
  }

  updateMaxValueErrorState(e: boolean) {
    this.maxValueErrorState = e;
    this.emitConstraint(); 
  }

  updateMinWeightErrorState(e: boolean) {
    this.minWeightErrorState = e;
    this.emitConstraint();
  }

  updateMaxWeightErrorState(e: boolean) {
    this.maxWeightErrorState = e;
    this.emitConstraint();
  }
}
