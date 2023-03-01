import { BASE_VALUE } from "../constants/constraints";
import { Exception } from "../utils/Exception";
import { Constraint } from "./Constraint";

export class BooleanConstraint extends Constraint {
  weight: string;
  constructor(id: string, name: string) {
    super(id, name);
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
}
