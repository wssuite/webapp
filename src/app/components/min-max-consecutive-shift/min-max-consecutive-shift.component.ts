import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BASE_VALUE } from 'src/app/constants/constraints';
import { MinMaxShiftConstraint } from 'src/app/models/MinMaxShiftConstraint';

@Component({
  selector: 'app-min-max-consecutive-shift',
  templateUrl: './min-max-consecutive-shift.component.html',
  styleUrls: ['./min-max-consecutive-shift.component.css']
})
export class MinMaxConsecutiveShiftComponent implements OnInit{

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
    this.maxWeightLabel = "weight for max value";
    this.minWeightLabel = "weight for min value"
  }

  ngOnInit(): void {
      this.selectFormCtrl.setValue(this.constraint.shiftId);
      this.minValueErrorState = this.constraint.minValue === '';
      this.maxValueErrorState = this.constraint.maxValue === '';
      this.maxWeightErrorState = this.constraint.maxWeight === BASE_VALUE;
      this.minWeightErrorState = this.constraint.minWeight === BASE_VALUE;
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
