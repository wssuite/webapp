import { Component } from "@angular/core";
import { shiftsExample } from "src/app/constants/shifts";
import { PatternElement } from "src/app/models/PatternElement";

@Component({
  selector: "app-contract-creation",
  templateUrl: "./contract-creation.component.html",
  styleUrls: ["./contract-creation.component.css"],
})
export class ContractCreationComponent {

  patternElement: PatternElement = {dayName:'', shiftId:''};
  shifts: string[] = shiftsExample;
}
