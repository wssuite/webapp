import { Component } from "@angular/core";
import {
  BASE_VALUE,
  MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_ID,
  MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_DISPLAY_NAME,
} from "src/app/constants/constraints";
import { MinMaxConstraint } from "src/app/models/MinMaxConstraint";

@Component({
  selector: "app-testing",
  templateUrl: "./testing.component.html",
  styleUrls: ["./testing.component.css"],
})
export class TestingComponent {
  constraint: MinMaxConstraint;

  constraintErrorState: boolean;
  weight = BASE_VALUE;

  constructor() {
    this.constraint = new MinMaxConstraint(
      MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_ID,
      MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_DISPLAY_NAME
    );
    this.constraintErrorState = true;
  }

  updateConstraintErrorState(e: boolean) {
    this.constraintErrorState = e;
  }
}
