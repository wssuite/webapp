import { Component } from '@angular/core';
import {
  BASE_VALUE,
  UNWANTED_SKILLS_DISPLAY_NAME,
  UNWANTED_SKILLS_ID,
} from "src/app/constants/constraints";
import { UnwantedSkills } from "src/app/models/UnwantedSkills";

@Component({
  selector: "app-testing",
  templateUrl: "./testing.component.html",
  styleUrls: ["./testing.component.css"],
})
export class TestingComponent {
  constraint: UnwantedSkills;
  constraintErrorState: boolean;
  weight = BASE_VALUE;
  SKILLS = ["Nurse", "headNurse", "Physiatre"]

  constructor() {
    this.constraint = new UnwantedSkills(
      UNWANTED_SKILLS_ID,
      UNWANTED_SKILLS_DISPLAY_NAME
    );
    this.constraintErrorState = true;
  }

  updateConstraintErrorState(e: boolean) {
    this.constraintErrorState = e;
  }
}
