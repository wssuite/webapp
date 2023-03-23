import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ALTERNATIVE_SHIFT_DISPLAY_NAME, ALTERNATIVE_SHIFT_ID, COMPLETE_WEEKEND_DISPLAY_NAME, COMPLETE_WEEKEND_ID, CONSTRAINTS, FREE_DAYS_AFTER_SHIFT_DISPLAY_NAME, FREE_DAYS_AFTER_SHIFT_ID, IDENTICAL_WEEKEND_DISPLAY_NAME, IDENTICAL_WEEKEND_ID, MIN_MAX_CONSECUTIVE_SHIFT_TYPE_DISPLAY_NAME, MIN_MAX_CONSECUTIVE_SHIFT_TYPE_ID, MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_DISPLAY_NAME, MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_ID, MIN_MAX_NUM_ASSIGNMENTS_IN_FOUR_WEEKS_DISPLAY_NAME, MIN_MAX_NUM_ASSIGNMENTS_IN_FOUR_WEEKS_ID, MIN_MAX_WORKING_HOURS_IN_FOUR_WEEKS_DISPLAY_NAME, MIN_MAX_WORKING_HOURS_IN_FOUR_WEEKS_ID, TOTAL_WEEKENDS_IN_FOUR_WEEKS_DISPLAY_NAME, TOTAL_WEEKENDS_IN_FOUR_WEEKS_ID, UNWANTED_PATTERNS_DISPLAY_NAME, UNWANTED_PATTERNS_ID, UNWANTED_SKILLS_DISPLAY_NAME, UNWANTED_SKILLS_ID } from "src/app/constants/constraints";
import { AlternativeShift } from "src/app/models/AlternativeShift";
import { BooleanConstraint } from "src/app/models/BooleanConstraint";
import { Contract } from "src/app/models/Contract";
import { MinMaxConstraint } from "src/app/models/MinMaxConstraint";
import { MinMaxShiftConstraint } from "src/app/models/MinMaxShiftConstraint";
import { ShiftConstraint } from "src/app/models/ShiftConstraint";
import { UnwantedPatterns } from "src/app/models/UnwantedPatterns";
import { UnwantedSkills } from "src/app/models/UnwantedSkills";

@Component({
  selector: "app-contract-creation",
  templateUrl: "./contract-creation.component.html",
  styleUrls: ["./contract-creation.component.css"],
})
export class ContractCreationComponent implements OnInit{

  @Input() contract!: Contract;
  @Output() contractChange: EventEmitter<Contract>;
  @Output() errorState: EventEmitter<boolean>;
  @Input() possibleShifts!: string[];
  @Input() possibleSkills!: string[];
  @Input() contracts!: string[]

  possibleConstraints: string[];
  constraintsErrorState: boolean[];
  nameFormCtrl: FormControl;
  unwantedPatternsId: string;
  alternativeShiftId: string;
  freeDaysAfterShiftId: string;
  minMaxConsecutiveShiftTypeId: string;
  identicalWeekendId: string;
  completeWeekendId: string; 
  totalNumberWeekendsId: string;
  minMaxConsecutiveWorkingWeekendsId: string;
  minMaxNbAssignmentsId: string;
  inputDisabled: boolean;
  unwantedSkillsId: string;
  minMaxWorkingHoursId: string;
  contractStartName!: string;


  constructor() {
    this.contractChange = new EventEmitter();
    this.errorState = new EventEmitter();

    this.possibleConstraints = CONSTRAINTS;
    this.constraintsErrorState = [];
    this.nameFormCtrl = new FormControl(null, Validators.required);
    this.unwantedPatternsId = UNWANTED_PATTERNS_ID;
    this.alternativeShiftId = ALTERNATIVE_SHIFT_ID;
    this.freeDaysAfterShiftId = FREE_DAYS_AFTER_SHIFT_ID;
    this.minMaxConsecutiveShiftTypeId = MIN_MAX_CONSECUTIVE_SHIFT_TYPE_ID;
    this.identicalWeekendId = IDENTICAL_WEEKEND_ID;
    this.completeWeekendId = COMPLETE_WEEKEND_ID;
    this.totalNumberWeekendsId = TOTAL_WEEKENDS_IN_FOUR_WEEKS_ID;
    this.minMaxConsecutiveWorkingWeekendsId = MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_ID;
    this.minMaxNbAssignmentsId = MIN_MAX_NUM_ASSIGNMENTS_IN_FOUR_WEEKS_ID;
    this.unwantedSkillsId = UNWANTED_SKILLS_ID;
    this.minMaxWorkingHoursId = MIN_MAX_WORKING_HOURS_IN_FOUR_WEEKS_ID
    this.inputDisabled = false;
  }

  ngOnInit(): void {
    this.inputDisabled = this.contract.name === ""? false: true;
    this.nameFormCtrl = new FormControl({value: this.contract.name, disabled: this.inputDisabled},
      Validators.required);
    this.contractStartName = this.contract.name;
    for(let i = 0; i< this.contract.constraints.length; i++){
      this.constraintsErrorState.push(true)
    }
    this.emitContract()
  }
  
  addConstraint(name: string) {
    let constraint;
    switch(name) {
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
        constraint = new MinMaxConstraint(TOTAL_WEEKENDS_IN_FOUR_WEEKS_ID, TOTAL_WEEKENDS_IN_FOUR_WEEKS_DISPLAY_NAME);
        break;

      case MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_DISPLAY_NAME:
        constraint = new MinMaxConstraint(MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_ID, MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_DISPLAY_NAME);
        break;
      
      case MIN_MAX_NUM_ASSIGNMENTS_IN_FOUR_WEEKS_DISPLAY_NAME:
        constraint = new MinMaxConstraint(MIN_MAX_NUM_ASSIGNMENTS_IN_FOUR_WEEKS_ID, MIN_MAX_NUM_ASSIGNMENTS_IN_FOUR_WEEKS_DISPLAY_NAME);
        break;
      
      case MIN_MAX_WORKING_HOURS_IN_FOUR_WEEKS_DISPLAY_NAME:
        constraint = new MinMaxConstraint(MIN_MAX_WORKING_HOURS_IN_FOUR_WEEKS_ID, MIN_MAX_WORKING_HOURS_IN_FOUR_WEEKS_DISPLAY_NAME);
        break;
        
      case UNWANTED_SKILLS_DISPLAY_NAME:
        constraint = new UnwantedSkills(UNWANTED_SKILLS_ID, UNWANTED_SKILLS_DISPLAY_NAME);
      break;

      default: break;
    }
    this.contract.constraints.push(constraint);
    this.constraintsErrorState.push(true);
    this.emitContract();
  }

  updateConstraintErrorState(index: number, e: boolean) {
    this.constraintsErrorState[index]= e;
    this.emitContract();
  }

  removeConstraint(index: number) {
    this.contract.constraints.splice(index,1);
    this.constraintsErrorState.splice(index,1);
    this.emitContract()
  }

  emitContract() {
    this.contractChange.emit(this.contract);
    this.emitErrorState();
  }

  emitErrorState() {
    console.log(this.constraintsErrorState);
    this.errorState.emit(this.nameFormCtrl.hasError('required') ||
                this.constraintsErrorState.includes(true) || (this.nameExist() && this.contractStartName === ''));
  }

  nameExist(): boolean {
    return this.contracts.includes(this.contract.name);
  }

  constraintHasErrorState(index:number){
    return this.constraintsErrorState[index];
  }
}
