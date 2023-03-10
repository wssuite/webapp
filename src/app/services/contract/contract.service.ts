import { Injectable } from '@angular/core';
import { ALTERNATIVE_SHIFT_DISPLAY_NAME, ALTERNATIVE_SHIFT_ID, COMPLETE_WEEKEND_DISPLAY_NAME, COMPLETE_WEEKEND_ID, FREE_DAYS_AFTER_SHIFT_DISPLAY_NAME, FREE_DAYS_AFTER_SHIFT_ID, IDENTICAL_WEEKEND_DISPLAY_NAME, IDENTICAL_WEEKEND_ID, MIN_MAX_CONSECUTIVE_SHIFT_TYPE_DISPLAY_NAME, MIN_MAX_CONSECUTIVE_SHIFT_TYPE_ID, MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_DISPLAY_NAME, MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_ID, MIN_MAX_NUM_ASSIGNMENTS_IN_FOUR_WEEKS_DISPLAY_NAME, MIN_MAX_NUM_ASSIGNMENTS_IN_FOUR_WEEKS_ID, TOTAL_WEEKENDS_IN_FOUR_WEEKS_DISPLAY_NAME, TOTAL_WEEKENDS_IN_FOUR_WEEKS_ID, UNWANTED_PATTERNS_DISPLAY_NAME, UNWANTED_PATTERNS_ID, UNWANTED_SKILLS_DISPLAY_NAME, UNWANTED_SKILLS_ID } from 'src/app/constants/constraints';
import { AlternativeShift, AlternativeShiftInterface } from 'src/app/models/AlternativeShift';
import { BooleanConstraint } from 'src/app/models/BooleanConstraint';
import { Constraint, ConstraintInterface } from 'src/app/models/Constraint';
import { Contract, ContractInterface } from 'src/app/models/Contract';
import { IntegerConstraint, IntegerConstraintInterface } from 'src/app/models/IntegerConstraint';
import { MinMaxConstraint, MinMaxConstraintInterface } from 'src/app/models/MinMaxConstraint';
import { MinMaxShiftConstraint, MinMaxShiftConstraintInterface } from 'src/app/models/MinMaxShiftConstraint';
import { ShiftConstraint, ShiftConstraintInterface } from 'src/app/models/ShiftConstraint';
import { UnwantedPatterns, UnwantedPatternsInterface} from 'src/app/models/UnwantedPatterns';
import { UnwantedSkills } from 'src/app/models/UnwantedSkills';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  contract: Contract;

  constructor() {
    this.contract = new Contract();
  }

  setContract(c: Contract) {
    this.contract = c;
  }

  validateContract(): void {
    // validate contract
    for(let i=0; i< this.contract.constraints.length; i++){
      for(let j=i+1; j< this.contract.constraints.length; j++){
        (this.contract.constraints[j] as Constraint).validateConstraint((this.contract.constraints[i] as Constraint));
      }
    }
  }

  getJson(): ContractInterface{
    return this.contract.toJson()
  }

  fromJson(contractJson: ContractInterface): Contract {
    const contract: Contract = new Contract();
    contract.name = contractJson.name;
    for(const c of (contractJson.constraints as ConstraintInterface[])){
      let constraint;
      switch(c.name) {
        case UNWANTED_PATTERNS_ID:
          constraint = new UnwantedPatterns(c.name, UNWANTED_PATTERNS_DISPLAY_NAME);
          constraint.fromJson(c as UnwantedPatternsInterface);
          break;

        case ALTERNATIVE_SHIFT_ID:
          constraint = new AlternativeShift(c.name, ALTERNATIVE_SHIFT_DISPLAY_NAME);
          constraint.fromJson(c as AlternativeShiftInterface);
          break;

        case FREE_DAYS_AFTER_SHIFT_ID:
          constraint = new ShiftConstraint(c.name, FREE_DAYS_AFTER_SHIFT_DISPLAY_NAME);
          constraint.fromJson(c as ShiftConstraintInterface);
          break;
        
        case MIN_MAX_CONSECUTIVE_SHIFT_TYPE_ID:
          constraint = new MinMaxShiftConstraint(c.name, MIN_MAX_CONSECUTIVE_SHIFT_TYPE_DISPLAY_NAME);
          constraint.fromJson(c as MinMaxShiftConstraintInterface);
          break;
        
        case IDENTICAL_WEEKEND_ID:
          constraint = new BooleanConstraint(c.name, IDENTICAL_WEEKEND_DISPLAY_NAME);
          constraint.fromJson(c as BooleanConstraint);
          break;

        case COMPLETE_WEEKEND_ID:
          constraint = new BooleanConstraint(c.name, COMPLETE_WEEKEND_DISPLAY_NAME);
          constraint.fromJson(c as BooleanConstraint);
          break;
        
        case TOTAL_WEEKENDS_IN_FOUR_WEEKS_ID:
          constraint = new IntegerConstraint(c.name, TOTAL_WEEKENDS_IN_FOUR_WEEKS_DISPLAY_NAME);
          constraint.fromJson(c as IntegerConstraintInterface);
          break;
        
        case MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_ID:
          constraint = new MinMaxConstraint(c.name, MIN_MAX_CONSECUTIVE_WORKING_WEEKENDS_DISPLAY_NAME);
          constraint.fromJson(c as MinMaxConstraintInterface);
          break;

        case MIN_MAX_NUM_ASSIGNMENTS_IN_FOUR_WEEKS_ID:
          constraint = new MinMaxConstraint(c.name, MIN_MAX_NUM_ASSIGNMENTS_IN_FOUR_WEEKS_DISPLAY_NAME);
          constraint.fromJson(c as MinMaxConstraintInterface);
          break;
        
        case UNWANTED_SKILLS_ID:
          constraint = new UnwantedSkills(c.name, UNWANTED_SKILLS_DISPLAY_NAME);
          constraint.fromJson(c as UnwantedSkills);
          break;

        default: break;
      }
      contract.constraints.push(constraint);
    }
    return contract;
  }
}
