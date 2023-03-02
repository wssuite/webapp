import { Component } from '@angular/core';
import { 
    IDENTICAL_WEEKEND_ID, 
    IDENTICAL_WEEKEND_DISPLAY_NAME,UNWANTED_PATTERNS_DISPLAY_NAME,
    UNWANTED_PATTERNS_ID, ALTERNATIVE_SHIFT_ID,
    ALTERNATIVE_SHIFT_DISPLAY_NAME, BASE_VALUE,
    FREE_DAYS_AFTER_SHIFT_DISPLAY_NAME,
    FREE_DAYS_AFTER_SHIFT_ID, MIN_MAX_CONSECUTIVE_SHIFT_TYPE_DISPLAY_NAME,
    MIN_MAX_CONSECUTIVE_SHIFT_TYPE_ID, TOTAL_WEEKENDS_IN_FOUR_WEEKS_DISPLAY_NAME,
    TOTAL_WEEKENDS_IN_FOUR_WEEKS_ID, MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_ID,
    MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_DISPLAY_NAME, } from 'src/app/constants/constraints';
import { shiftsExample } from 'src/app/constants/shifts';
import { AlternativeShift } from 'src/app/models/AlternativeShift';
import { MinMaxShiftConstraint } from 'src/app/models/MinMaxShiftConstraint';
import { ShiftConstraint } from 'src/app/models/ShiftConstraint';
import { UnwantedPatterns } from 'src/app/models/UnwantedPatterns';
import { BooleanConstraint } from "src/app/models/BooleanConstraint";
import { IntegerConstraint } from "src/app/models/IntegerConstraint";
import { MinMaxConstraint } from 'src/app/models/MinMaxConstraint';

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
  minMaxShiftConstraintErrorState: boolean;
  booleanConstraint: BooleanConstraint;
  booleanConstraintErrorState: boolean;

  unwantedPatternsConstraint: UnwantedPatterns;
  unwantedPatternsErrorState: boolean;

  integerConstraint: IntegerConstraint;
  integerConstraintErrorState:boolean;

  minMaxConstraint: MinMaxConstraint;
  minMaxErrorConstraint: boolean;

  constructor() {
    this.possibleShifts = shiftsExample;
    this.alternativeConstraint = new AlternativeShift(ALTERNATIVE_SHIFT_ID,ALTERNATIVE_SHIFT_DISPLAY_NAME);
    this.alternativeShiftConstraintErrorState = true;
    this.shiftTypeConstraint = new ShiftConstraint(FREE_DAYS_AFTER_SHIFT_ID, FREE_DAYS_AFTER_SHIFT_DISPLAY_NAME);
    this.shiftTypeConstraintErrorState = true;
    this.minMaxConsecutiveShift = new MinMaxShiftConstraint(MIN_MAX_CONSECUTIVE_SHIFT_TYPE_ID, MIN_MAX_CONSECUTIVE_SHIFT_TYPE_DISPLAY_NAME);
    this.minMaxShiftConstraintErrorState = true;
    this.unwantedPatternsConstraint = new UnwantedPatterns(UNWANTED_PATTERNS_ID,UNWANTED_PATTERNS_DISPLAY_NAME);
    this.unwantedPatternsErrorState = true;
    this.booleanConstraint = new BooleanConstraint(
      IDENTICAL_WEEKEND_ID,
      IDENTICAL_WEEKEND_DISPLAY_NAME
    );
    this.booleanConstraintErrorState = true;
    this.integerConstraint = new IntegerConstraint(TOTAL_WEEKENDS_IN_FOUR_WEEKS_ID, TOTAL_WEEKENDS_IN_FOUR_WEEKS_DISPLAY_NAME);
    this.integerConstraintErrorState = true;
    this.minMaxErrorConstraint = true;
    this.minMaxConstraint = new MinMaxConstraint(MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_ID, MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_DISPLAY_NAME);
  }

  updateBooleanConstraintErrorState(e: boolean) {
    this.booleanConstraintErrorState = e;
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

  undateUnwantedPatternsErrorState(e:boolean) {
    this.unwantedPatternsErrorState = e;
  }
  
  updateMinMaxShiftConstraintErrorState(e:boolean) {
    this.minMaxShiftConstraintErrorState = e;
  }

  updateIntegerConstraintErrorState(e:boolean) {
    this.integerConstraintErrorState = e;
  }

  updateMinMaxConstraintErrorState(e:boolean) {
    this.minMaxErrorConstraint = e;
  }
}
