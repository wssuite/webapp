import { Component } from "@angular/core";
import {
  TOTAL_NUMBER_OF_WEEKENDS_IN_FOUR_WEEKS_DISPLAY_NAME,
  TOTAL_NUMBER_OF_WEEKENDS_IN_FOUR_WEEKS_ID,
} from "src/app/constants/constraints";
import { IntegerConstraint } from "src/app/models/IntegerConstraint";

@Component({
  selector: "app-testing",
  templateUrl: "./testing.component.html",
  styleUrls: ["./testing.component.css"],
})
export class TestingComponent {
  constraint: IntegerConstraint = new IntegerConstraint(
    TOTAL_NUMBER_OF_WEEKENDS_IN_FOUR_WEEKS_ID,
    TOTAL_NUMBER_OF_WEEKENDS_IN_FOUR_WEEKS_DISPLAY_NAME
  );

  constraintErrorState = true;

  updateConstraintErrorState(e: boolean) {
    this.constraintErrorState = e;
  }
}
