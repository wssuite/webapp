import { Component } from '@angular/core';
import { UNWANTED_PATTERNS_DISPLAY_NAME, UNWANTED_PATTERNS_ID, ALTERNATIVE_SHIFT_ID,ALTERNATIVE_SHIFT_DISPLAY_NAME, BASE_VALUE, FREE_DAYS_AFTER_SHIFT_DISPLAY_MAME, FREE_DAYS_AFTER_SHIFT_ID, MIN_MAX_CONSECUTIVE_SHIFT_TYPE_DISPLAY_NAME, MIN_MAX_CONSECUTIVE_SHIFT_TYPE_ID } from 'src/app/constants/constraints';
import { shiftExample} from 'src/app/constants/shifts';
import { AlternativeShift } from 'src/app/models/AlternativeShift';
import { MinMaxShiftConstraint } from 'src/app/models/MinMaxShiftConstraint';
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
  minMaxConsecutiveShift: MinMaxShiftConstraint;
  minMaxConstraintErrorState: boolean;

  unwantedPatternsConstraint: UnwantedPatterns;
  unwantedPatternsErrorState: boolean;

  constructor() {
    this.possibleShifts = shiftExample;
    this.alternativeConstraint = new AlternativeShift(ALTERNATIVE_SHIFT_ID,ALTERNATIVE_SHIFT_DISPLAY_NAME);
    this.alternativeShiftConstraintErrorState = true;
    this.shiftTypeConstraint = new ShiftConstraint(FREE_DAYS_AFTER_SHIFT_ID, FREE_DAYS_AFTER_SHIFT_DISPLAY_MAME);
    this.shiftTypeConstraintErrorState = true;
    this.minMaxConsecutiveShift = new MinMaxShiftConstraint(MIN_MAX_CONSECUTIVE_SHIFT_TYPE_ID, MIN_MAX_CONSECUTIVE_SHIFT_TYPE_DISPLAY_NAME);
    this.minMaxConstraintErrorState = true;
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

  updateMinMaxConstraintErrorState(e:boolean) {
    this.minMaxConstraintErrorState = e;
  }
}
