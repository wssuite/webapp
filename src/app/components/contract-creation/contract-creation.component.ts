import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import {  ALTERNATIVE_SHIFT_ID, CONSTRAINTS, DISPLAY_NAME_CONSTRAINT_MAP, FREE_DAYS_AFTER_SHIFT_ID, MIN_MAX_CONSECUTIVE_SHIFT_TYPE_ID, UNWANTED_PATTERNS_ID } from "src/app/constants/constraints";
import { shiftsExample } from "src/app/constants/shifts";
import { Contract } from "src/app/models/Contract";

@Component({
  selector: "app-contract-creation",
  templateUrl: "./contract-creation.component.html",
  styleUrls: ["./contract-creation.component.css"],
})
export class ContractCreationComponent {

  contract: Contract;
  possibleShifts: string[];
  possibleConstraints: string[];
  chosenConstraint: string;
  constraintsErrorState: boolean[];
  nameFormCtrl: FormControl;
  unwantedPatternsId: string;
  alternativeShiftId: string;
  freeDaysAfterShiftId: string;
  minMaxConsecutiveShiftTypeId: string;

  constructor() {
    this.contract = new Contract();
    this.possibleShifts = shiftsExample;
    this.possibleConstraints = CONSTRAINTS;
    this.chosenConstraint = '';
    this.constraintsErrorState = [];
    this.nameFormCtrl = new FormControl(null, Validators.required);
    this.unwantedPatternsId = UNWANTED_PATTERNS_ID;
    this.alternativeShiftId = ALTERNATIVE_SHIFT_ID;
    this.freeDaysAfterShiftId = FREE_DAYS_AFTER_SHIFT_ID;
    this.minMaxConsecutiveShiftTypeId = MIN_MAX_CONSECUTIVE_SHIFT_TYPE_ID;
  }
  
  addConstraint() {
    const constraint = DISPLAY_NAME_CONSTRAINT_MAP.get(this.chosenConstraint);
    if(constraint === undefined || constraint === null) {
      return;
    }
    this.contract.constraints.push(constraint);
    this.constraintsErrorState.push(true);
  }

  updateConstraintErrorState(index: number, e: boolean) {
    this.constraintsErrorState[index]= e;
  }

  removeConstraint(index: number) {
    this.contract.constraints.splice(index);
  }
}
