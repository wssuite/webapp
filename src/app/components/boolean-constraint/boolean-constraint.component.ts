import { Component, Input } from "@angular/core";
import { BooleanConstraint } from "src/app/models/BooleanConstraint";

@Component({
  selector: "app-boolean-constraint",
  templateUrl: "./boolean-constraint.component.html",
  styleUrls: ["./boolean-constraint.component.css"],
})
export class BooleanConstraintComponent {
  weightValue = "0";
  weightLabel = "weight";

  @Input() booleanConstraint!: BooleanConstraint;

  constructor() {}
}
