import { Component } from "@angular/core";
import {
  COMPLETE_WEEKEND_DISPLAY_ID,
  COMPLETE_WEEKEND_DISPLAY_NAME,
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
  completeWeekendConstraint: BooleanConstraint = new BooleanConstraint(
    COMPLETE_WEEKEND_DISPLAY_ID,
    COMPLETE_WEEKEND_DISPLAY_NAME
  );

  identicalWeekendConstraint: BooleanConstraint = new BooleanConstraint(
    IDENTICAL_WEEKEND_DISPLAY_ID,
    IDENTICAL_WEEKEND_DISPLAY_NAME
  );
}
