import { Component, Input } from "@angular/core";
import { BASE_VALUE, WEIGHT_LABEL } from "src/app/constants/constraints";
import { BooleanConstraint } from "src/app/models/BooleanConstraint";

@Component({
  selector: "app-boolean-constraint",
  templateUrl: "./boolean-constraint.component.html",
  styleUrls: ["./boolean-constraint.component.css"],
})
export class BooleanConstraintComponent {
  weightLabel = WEIGHT_LABEL;

  @Input() constraint!: BooleanConstraint;
}
