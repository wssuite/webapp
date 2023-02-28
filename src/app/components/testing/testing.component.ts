import { Component } from "@angular/core";
import {
  BASE_VALUE,
  IDENTICAL_WEEKEND_DISPLAY_ID,
  IDENTICAL_WEEKEND_DISPLAY_NAME,
} from "src/app/constants/constraints";
import { BooleanConstraint } from "src/app/models/BooleanConstraint";

@Component({
  selector: "app-testing",
  templateUrl: "./testing.component.html",
  styleUrls: ["./testing.component.css"],
})
export class TestingComponent {
  identicalWeekendConstraint: BooleanConstraint;

  constraintErrorState: boolean;
  weight = BASE_VALUE;

  constructor() {
    this.identicalWeekendConstraint = new BooleanConstraint(
      IDENTICAL_WEEKEND_DISPLAY_ID,
      IDENTICAL_WEEKEND_DISPLAY_NAME
    );
    this.constraintErrorState = true;
  }

  updateConstraintErrorState(e: boolean) {
    this.constraintErrorState = e;
  }
}
