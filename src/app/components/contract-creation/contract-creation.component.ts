import { Component } from "@angular/core";
import { ALTERNATIVE_SHIFT_DISPLAY_NAME, BASE_VALUE } from "src/app/constants/constraints";
import { shiftsExample } from "src/app/constants/shifts";
import { AlternativeShift } from "src/app/models/AlternativeShift";

@Component({
  selector: "app-contract-creation",
  templateUrl: "./contract-creation.component.html",
  styleUrls: ["./contract-creation.component.css"],
})
export class ContractCreationComponent {
  weight = BASE_VALUE;
  possibleShifts: string[]
  constraint: AlternativeShift;
  constraintErrorState: boolean;

  constructor() {
    this.possibleShifts = shiftsExample;
    this.constraint = new AlternativeShift(ALTERNATIVE_SHIFT_DISPLAY_NAME);
    this.constraintErrorState = true;
  }

  updateConstraintErrorState(e: boolean){
    this.constraintErrorState = e;
  }

}
