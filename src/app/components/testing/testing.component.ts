import { Component } from '@angular/core';
import { UNWANTED_PATTERNS_DISPLAY_NAME, UNWANTED_PATTERNS_ID ,ALTERNATIVE_SHIFT_ID, ALTERNATIVE_SHIFT_DISPLAY_NAME, BASE_VALUE, FREE_DAYS_AFTER_SHIFT_DISPLAY_MAME, FREE_DAYS_AFTER_SHIFT_ID } from 'src/app/constants/constraints';
import { shiftsExample } from 'src/app/constants/shifts';
import { AlternativeShift } from 'src/app/models/AlternativeShift';
import { ShiftConstraint } from 'src/app/models/ShiftConstraint';
import { UnwantedPatterns } from 'src/app/models/UnwantedPatterns';

@Component({
  selector: "app-testing",
  templateUrl: "./testing.component.html",
  styleUrls: ["./testing.component.css"],
})
export class TestingComponent {
  weight = BASE_VALUE;
  possibleShifts: string[]
  alternativeConstraint: AlternativeShift;
  alternativeShiftConstraintErrorState: boolean;
  shiftTypeConstraint: ShiftConstraint;
  shiftTypeConstraintErrorState: boolean;
  unwantedPatternsConstraint: UnwantedPatterns;
  unwantedPatternsErrorState: boolean;

  constructor() {
    this.possibleShifts = shiftsExample;
    this.alternativeConstraint = new AlternativeShift(ALTERNATIVE_SHIFT_ID,ALTERNATIVE_SHIFT_DISPLAY_NAME);
    this.alternativeShiftConstraintErrorState = true;
    this.shiftTypeConstraint = new ShiftConstraint(FREE_DAYS_AFTER_SHIFT_ID, FREE_DAYS_AFTER_SHIFT_DISPLAY_MAME);
    this.shiftTypeConstraintErrorState = true;
    this.unwantedPatternsConstraint = new UnwantedPatterns(UNWANTED_PATTERNS_ID,UNWANTED_PATTERNS_DISPLAY_NAME);
    this.unwantedPatternsErrorState = true;
  }


  updateUnwantedPatternsErrorState(e: boolean) {
    this.unwantedPatternsErrorState = e
  }
  
  updateAlternativeConstraintErrorState(e: boolean){
    this.alternativeShiftConstraintErrorState = e;
  }

  updateShiftConstraintErrorState(e:boolean) {
    this.shiftTypeConstraintErrorState = e;
  }
}
