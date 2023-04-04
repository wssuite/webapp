import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BASE_VALUE } from 'src/app/constants/constraints';
import { AlternativeShift } from 'src/app/models/AlternativeShift';

@Component({
  selector: 'app-alternative-shift',
  templateUrl: './alternative-shift.component.html',
  styleUrls: ['./alternative-shift.component.css']
})
export class AlternativeShiftComponent implements OnInit{

  @Input() constraint!: AlternativeShift;
  @Output() constraintChange: EventEmitter<AlternativeShift>;
  @Output() errorState: EventEmitter<boolean>;
  @Input() possibleShifts!: string[];
  weightErrorState: boolean;
  shiftSelectorCtrl: FormControl;
  weightLabel: string;

  constructor(){
    this.constraintChange = new EventEmitter();
    this.errorState = new EventEmitter();
    this.weightErrorState = true;
    this.shiftSelectorCtrl =new FormControl(null, Validators.required);
    this.weightLabel = "weight";
    
  }

  ngOnInit(): void {
    if(!this.possibleShifts.includes(this.constraint.shiftId)){
      this.constraint.shiftId = "";
    }
    this.shiftSelectorCtrl.setValue(this.constraint.shiftId);
    this.weightErrorState = this.constraint.weight === BASE_VALUE;
    this.emitConstraint();    
  }

  emitConstraint() {
    this.constraintChange.emit(this.constraint);
    this.emitErrorState();
  }

  emitErrorState() {
    this.errorState.emit(this.shiftSelectorCtrl.hasError('required') || this.weightErrorState);
  }

  updateWeightErrorState(e: boolean) {
    this.weightErrorState = e;
    this.emitConstraint();
  }
}
