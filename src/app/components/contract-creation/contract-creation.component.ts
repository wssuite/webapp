import { Component } from "@angular/core";
import { UNWANTED_PATTERNS_DISPLAY_NAME } from "src/app/constants/constraints";
//import { shiftsExample } from "src/app/constants/shifts";
//import { PatternElement } from "src/app/models/PatternElement";
import { UnwantedPatterns } from "src/app/models/UnwantedPatterns";

@Component({
  selector: "app-contract-creation",
  templateUrl: "./contract-creation.component.html",
  styleUrls: ["./contract-creation.component.css"],
})
export class ContractCreationComponent {

  constraint: UnwantedPatterns = new UnwantedPatterns(UNWANTED_PATTERNS_DISPLAY_NAME);

  errorState = true;

  changeState(e: boolean) {
    this.errorState = e;
  }
}
