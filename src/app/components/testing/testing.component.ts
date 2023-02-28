import { Component } from '@angular/core';
import { UNWANTED_PATTERNS_DISPLAY_NAME, UNWANTED_PATTERNS_ID ,ALTERNATIVE_SHIFT_DISPLAY_NAME, ALTERNATIVE_SHIFT_ID, BASE_VALUE } from 'src/app/constants/constraints';
import { shiftsExample } from 'src/app/constants/shifts';
import { AlternativeShift } from 'src/app/models/AlternativeShift';
import { UnwantedPatterns } from 'src/app/models/UnwantedPatterns';

@Component({
  selector: "app-testing",
  templateUrl: "./testing.component.html",
  styleUrls: ["./testing.component.css"],
})
export class TestingComponent {
  weight = BASE_VALUE;
  possibleShifts: string[]
  alternativeShiftConstraint: AlternativeShift;
  alternativeShiftConstraintErrorState: boolean;
  unwantedPatternsConstraint: UnwantedPatterns;
  unwantedPatternsErrorState: boolean;

  constructor() {
    this.possibleShifts = shiftsExample;
    this.alternativeShiftConstraint = new AlternativeShift(ALTERNATIVE_SHIFT_ID,ALTERNATIVE_SHIFT_DISPLAY_NAME);
    this.alternativeShiftConstraintErrorState = true;
    this.unwantedPatternsConstraint = new UnwantedPatterns(UNWANTED_PATTERNS_ID,UNWANTED_PATTERNS_DISPLAY_NAME);
    this.unwantedPatternsErrorState = true;
  }

  updateUnwantedPatternsErrorState(e: boolean) {
    this.unwantedPatternsErrorState = e
  }

  updateAlternativeShiftConstraintErrorState(e: boolean){
    this.alternativeShiftConstraintErrorState = e;
  }
}
