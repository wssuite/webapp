import { Component } from '@angular/core';
import { UNWANTED_PATTERNS_DISPLAY_NAME, UNWANTED_PATTERNS_ID } from 'src/app/constants/constraints';
import { shiftsExample } from 'src/app/constants/shifts';
import { UnwantedPatterns } from 'src/app/models/UnwantedPatterns';

@Component({
  selector: "app-testing",
  templateUrl: "./testing.component.html",
  styleUrls: ["./testing.component.css"],
})
export class TestingComponent {
  constraint: UnwantedPatterns = new UnwantedPatterns(UNWANTED_PATTERNS_ID,UNWANTED_PATTERNS_DISPLAY_NAME);
  possibleShifts: string[] = shiftsExample;

  errorState = true;

  changeState(e: boolean) {
    this.errorState = e;
  }
}
