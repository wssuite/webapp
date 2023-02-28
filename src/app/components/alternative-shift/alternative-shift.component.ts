import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AlternativeShift } from 'src/app/models/AlternativeShift';

@Component({
  selector: 'app-alternative-shift',
  templateUrl: './alternative-shift.component.html',
  styleUrls: ['./alternative-shift.component.css']
})
export class AlternativeShiftComponent {

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
