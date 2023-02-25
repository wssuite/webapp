import { Component } from '@angular/core';
import { UNWANTED_PATTERNS_DISPLAY_NAME } from 'src/app/constants/constraints';
import { UnwantedPatterns } from 'src/app/models/UnwantedPatterns';

@Component({
  selector: "app-testing",
  templateUrl: "./testing.component.html",
  styleUrls: ["./testing.component.css"],
})
export class TestingComponent {
  constraint: UnwantedPatterns = new UnwantedPatterns(UNWANTED_PATTERNS_DISPLAY_NAME);

  errorState = true;

  changeState(e: boolean) {
    this.errorState = e;
  }
}
