import { Component } from "@angular/core";
import { BooleanConstraint } from "src/app/models/BooleanConstraint";

@Component({
  selector: "app-testing",
  templateUrl: "./testing.component.html",
  styleUrls: ["./testing.component.css"],
})
export class TestingComponent {
  weightValue = "0";
  label = "weight";

  completeWeekendConstraint: BooleanConstraint = new BooleanConstraint(
    "completeWeekend",
    "Complete Weekend"
  );

  identicalWeekendConstraint: BooleanConstraint = new BooleanConstraint(
    "identicalWeekend",
    "Identical Weekend"
  );
}
