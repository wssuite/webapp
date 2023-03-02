import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ALTERNATIVE_SHIFT_DISPLAY_NAME, ALTERNATIVE_SHIFT_ID, COMPLETE_WEEKEND_DISPLAY_NAME, COMPLETE_WEEKEND_ID, CONSTRAINTS, FREE_DAYS_AFTER_SHIFT_DISPLAY_NAME, FREE_DAYS_AFTER_SHIFT_ID, IDENTICAL_WEEKEND_DISPLAY_NAME, IDENTICAL_WEEKEND_ID, MIN_MAX_CONSECUTIVE_SHIFT_TYPE_DISPLAY_NAME, MIN_MAX_CONSECUTIVE_SHIFT_TYPE_ID, TOTAL_WEEKENDS_IN_FOUR_WEEKS_DISPLAY_NAME, TOTAL_WEEKENDS_IN_FOUR_WEEKS_ID, UNWANTED_PATTERNS_DISPLAY_NAME, UNWANTED_PATTERNS_ID } from "src/app/constants/constraints";
import { AlternativeShift } from "src/app/models/AlternativeShift";
import { BooleanConstraint } from "src/app/models/BooleanConstraint";
import { Contract } from "src/app/models/Contract";
import { IntegerConstraint } from "src/app/models/IntegerConstraint";
import { MinMaxShiftConstraint } from "src/app/models/MinMaxShiftConstraint";
import { ShiftConstraint } from "src/app/models/ShiftConstraint";
import { UnwantedPatterns } from "src/app/models/UnwantedPatterns";

@Component({
  selector: "app-contract-creation",
  templateUrl: "./contract-creation.component.html",
  styleUrls: ["./contract-creation.component.css"],
})
export class ContractCreationComponent implements OnInit {

  @Input() contract!: Contract;
  @Output() contractChange: EventEmitter<Contract>;
  @Output() errorState: EventEmitter<boolean>;
  @Input() possibleShifts!: string[];

  possibleConstraints: string[];
  chosenConstraint: string;
  constraintsErrorState: boolean[];
  nameFormCtrl: FormControl;
  unwantedPatternsId: string;
  alternativeShiftId: string;
  freeDaysAfterShiftId: string;
  minMaxConsecutiveShiftTypeId: string;
  identicalWeekendId: string;
  completeWeekendId: string; 
  skillsFormCtrls: FormControl[];
  totalNumberWeekendsId: string;

  constructor() {
    this.contractChange = new EventEmitter();
    this.errorState = new EventEmitter();

    this.possibleConstraints = CONSTRAINTS;
    this.chosenConstraint = '';
    this.constraintsErrorState = [];
    this.nameFormCtrl = new FormControl(null, Validators.required);
    this.unwantedPatternsId = UNWANTED_PATTERNS_ID;
    this.alternativeShiftId = ALTERNATIVE_SHIFT_ID;
    this.freeDaysAfterShiftId = FREE_DAYS_AFTER_SHIFT_ID;
    this.minMaxConsecutiveShiftTypeId = MIN_MAX_CONSECUTIVE_SHIFT_TYPE_ID;
    this.identicalWeekendId = IDENTICAL_WEEKEND_ID;
    this.completeWeekendId = COMPLETE_WEEKEND_ID;
    this.skillsFormCtrls = [];
    this.totalNumberWeekendsId = TOTAL_WEEKENDS_IN_FOUR_WEEKS_ID;
  }
  ngOnInit(): void {
    for(let i=0; i< this.contract.skills.length; i++) {
      this.skillsFormCtrls.push(new FormControl(null, Validators.required));
    }
  }
  
  addConstraint() {
    let constraint;
    switch(this.chosenConstraint) {
      case UNWANTED_PATTERNS_DISPLAY_NAME:
        constraint = new UnwantedPatterns(UNWANTED_PATTERNS_ID, UNWANTED_PATTERNS_DISPLAY_NAME); 
        break;

      case ALTERNATIVE_SHIFT_DISPLAY_NAME:
        constraint = new AlternativeShift(ALTERNATIVE_SHIFT_ID, ALTERNATIVE_SHIFT_DISPLAY_NAME);
        break;

      case FREE_DAYS_AFTER_SHIFT_DISPLAY_NAME:
        constraint = new ShiftConstraint(FREE_DAYS_AFTER_SHIFT_ID, FREE_DAYS_AFTER_SHIFT_DISPLAY_NAME);
        break;

      case MIN_MAX_CONSECUTIVE_SHIFT_TYPE_DISPLAY_NAME:
        constraint = new MinMaxShiftConstraint(MIN_MAX_CONSECUTIVE_SHIFT_TYPE_ID, MIN_MAX_CONSECUTIVE_SHIFT_TYPE_DISPLAY_NAME);
        break;

      case IDENTICAL_WEEKEND_DISPLAY_NAME:
        constraint = new BooleanConstraint(IDENTICAL_WEEKEND_ID, IDENTICAL_WEEKEND_DISPLAY_NAME);
        break;

      case COMPLETE_WEEKEND_DISPLAY_NAME:
        constraint = new BooleanConstraint(COMPLETE_WEEKEND_ID, COMPLETE_WEEKEND_DISPLAY_NAME);
        break;

      case TOTAL_WEEKENDS_IN_FOUR_WEEKS_DISPLAY_NAME:
        constraint = new IntegerConstraint(TOTAL_WEEKENDS_IN_FOUR_WEEKS_ID, TOTAL_WEEKENDS_IN_FOUR_WEEKS_DISPLAY_NAME);
        break;
      default: break;
    }
    console.log(constraint);
    this.contract.constraints.push(constraint);
    this.constraintsErrorState.push(true);
    this.emitContract();
  }

  updateConstraintErrorState(index: number, e: boolean) {
    this.constraintsErrorState[index]= e;
    this.emitContract();
  }

  removeConstraint(index: number) {
    this.contract.constraints.splice(index);
    this.emitContract()
  }

  emitContract() {
    this.contractChange.emit(this.contract);
    this.emitErrorState();
  }

  emitErrorState() {
    let skillError = false;
    for(const form of this.skillsFormCtrls){
      if(form.hasError('required')) {
        skillError = true;
        break;
      }
    }
    this.errorState.emit(skillError||this.nameFormCtrl.hasError('required') ||
                this.constraintsErrorState.includes(true));
  }

  addSkill() {
    this.contract.skills.push("");
    this.skillsFormCtrls.push(new FormControl(null, Validators.required));
    this.emitContract();
  }

  deleteSkill(i:number){
    this.contract.skills.splice(i,1);
    this.skillsFormCtrls.splice(i,1);
    this.emitContract();
  }

  trackByFn(index: number) {
    return index;  
  }
}
