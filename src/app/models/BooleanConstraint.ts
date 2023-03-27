import { BASE_VALUE } from "../constants/constraints";
import { Exception } from "../utils/Exception";
import { Constraint, ConstraintInterface } from "./Constraint";

export class BooleanConstraint extends Constraint {
  weight: string;
  constructor(id: string, name: string, description?: string) {
    super(id, name, description);
    this.weight = BASE_VALUE;
  }
  
  validateConstraint(c: Constraint): void{
    const constraint = c as BooleanConstraint;
    if(!constraint){
      return;
    }
    if(constraint.displayName === this.displayName){
      if(constraint.weight === this.weight) {
        throw new Exception(this.getRepetitiveErrorMessage())
      }
      throw new Exception(this.getContradictionErrorMessage());
      
    }
  }

  toJson(): BooleanConstraintInterface {
    return {
      name: this.name,
      weight: this.weight,
    }
  }
  
  fromJson(c: BooleanConstraintInterface): void {
    this.weight = c.weight;
  }

  clone(): BooleanConstraint {
    const ret = new BooleanConstraint(this.name, this.displayName);
    ret.weight = this.weight;
    return ret;
  }

  equals(c: BooleanConstraint): boolean {
    return c.name === this.name && c.weight === this.weight;
  }
}

export interface BooleanConstraintInterface extends ConstraintInterface {
  weight: string;
}
