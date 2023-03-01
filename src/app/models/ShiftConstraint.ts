import { Exception } from "../utils/Exception";
import { Constraint } from "./Constraint";
import { IntegerConstraint } from "./IntegerConstraint";

export class ShiftConstraint extends IntegerConstraint {
    shiftId: string;
    constructor(name: string, displayName: string) {
        super(name, displayName);
        this.shiftId = '';
    }

    override validateConstraint(c: Constraint): void {
        const constraint = c as ShiftConstraint;
        if(!constraint){
            return;
        }
        if(this.displayName !== constraint.displayName || this.shiftId !== constraint.shiftId) {
           return; 
        }
        if(this.value === constraint.value && this.weight === constraint.weight) {
            throw new Exception(this.getRepetitiveErrorMessage());
        }
        throw new Exception(this.getContradictionErrorMessage());
    }
}