import { BASE_VALUE } from "../constants/constraints";
import { Exception } from "../utils/Exception";
import { Constraint } from "./Constraint";

export class IntegerConstraint extends Constraint {
  value: string;
  weight: string;
  units: string[];
  chosenUnit: string;

  constructor(name: string, displayName: string) {
    super(name, displayName);
    this.value = BASE_VALUE;
    this.weight = BASE_VALUE;
    this.units = ["hours", "shifts"];
    this.chosenUnit = this.units[0];
  }

  validateConstraint(c: Constraint): void {
    const constraint = c as IntegerConstraint;
    if(!constraint){
      return;
    }
    if(this.displayName !== constraint.displayName) {
      return;
    }
    if(this.value === constraint.value
      && this.weight === constraint.weight){
        throw new Exception(this.getRepetitiveErrorMessage());
    }
    if((this.value === constraint.value && this.weight !== constraint.weight)
    || (this.value !== constraint.value && this.weight === constraint.weight)) {
      throw new Exception(this.getContradictionErrorMessage());
    }
  }
}