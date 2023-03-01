import { Exception } from "../utils/Exception";
import { Constraint } from "./Constraint";
import { MinMaxConstraint } from "./MinMaxConstraint";

export class MinMaxShiftConstraint extends MinMaxConstraint{

    shiftId: string;

    constructor(name:string, displayName: string) {
        super(name, displayName);
        this.shiftId = '';
    }

    override validateConstraint(c: Constraint): void {
        const constraint = c as MinMaxShiftConstraint;
        if(!constraint) {
            return;
        }
        if(this.displayName !== constraint.displayName || this.shiftId !== constraint.shiftId){
            return;
        }
        if(this.minValue === constraint.minValue &&
            this.minWeight === constraint.minWeight &&
            this.maxValue === constraint.maxValue &&
            this.maxWeight === constraint.maxWeight){
                throw new Exception(this.getRepetitiveErrorMessage());
            }
        throw new Exception(this.getContradictionErrorMessage())
    }
}