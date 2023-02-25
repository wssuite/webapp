import { Component } from '@angular/core';
import { ALTERNATIVE_SHIFT_DISPLAY_NAME, ALTERNATIVE_SHIFT_ID, BASE_VALUE } from 'src/app/constants/constraints';
import { shiftsExample } from 'src/app/constants/shifts';
import { AlternativeShift } from 'src/app/models/AlternativeShift';

@Component({
  selector: "app-testing",
  templateUrl: "./testing.component.html",
  styleUrls: ["./testing.component.css"],
})
export class TestingComponent {
  weight = BASE_VALUE;
  possibleShifts: string[]
  constraint: AlternativeShift;
  constraintErrorState: boolean;

  constructor() {
    this.possibleShifts = shiftsExample;
    this.constraint = new AlternativeShift(ALTERNATIVE_SHIFT_ID,ALTERNATIVE_SHIFT_DISPLAY_NAME);
    this.constraintErrorState = true;
  }

  updateConstraintErrorState(e: boolean){
    this.constraintErrorState = e;
  }
}
