import { BASE_VALUE } from "../constants/constraints";
import { Exception } from "../utils/Exception";
import { Constraint, ConstraintInterface } from "./Constraint";

export class IntegerConstraint extends Constraint {
  value: string;
  weight: string;
  constructor(id: string, name: string) {
    super(id, name);
    this.value = BASE_VALUE;
    this.weight = BASE_VALUE;
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

  toJson(): IntegerConstraintInterface {
    return {
      name: this.name,
      value: this.value,
      weight: this.weight
    }
  }

  fromJson(c: IntegerConstraintInterface): void {
      this.value = c.value;
      this.weight = c.weight;
  }
}

export interface IntegerConstraintInterface extends ConstraintInterface {
  value: string;
  weight: string;
}
