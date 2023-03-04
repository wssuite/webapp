import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ShiftConstraint } from 'src/app/models/ShiftConstraint';

@Component({
  selector: 'app-shift-constraint',
  templateUrl: './shift-constraint.component.html',
  styleUrls: ['./shift-constraint.component.css']
})
export class ShiftConstraintComponent implements OnInit{

  @Input() constraint!: ShiftConstraint;
  @Output() constraintChange: EventEmitter<ShiftConstraint>;
  @Input() possibleShifts! : string[];
  @Output() errorState: EventEmitter<boolean>;
  weightErrorState: boolean;
  selectFormCtrl: FormControl;
  weightLabel: string;
  valueErrorState: boolean;

  constructor(){
    this.constraintChange = new EventEmitter();
    this.errorState = new EventEmitter();
    this.weightErrorState = true;
    this.selectFormCtrl = new FormControl(null, Validators.required);
    this.weightLabel = "weight";
    this.valueErrorState = true;
  }

  ngOnInit(): void {
      this.selectFormCtrl.setValue(this.constraint.shiftId);
  }

  emitErrorState() {
    this.errorState.emit(this.selectFormCtrl.hasError('required') || this.weightErrorState || this.valueErrorState);
  }

  emitConstraint() {
    this.constraintChange.emit(this.constraint);
    this.emitErrorState();
  }

  updateWeightErrorState(e:boolean) {
    this.weightErrorState = e;
    this.emitConstraint();
  }

  updateValueErrorState(e: boolean) {
    this.valueErrorState = e;
    this.emitConstraint();
  }
}
