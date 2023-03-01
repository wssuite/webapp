import { BASE_VALUE } from "../constants/constraints";
import { Exception } from "../utils/Exception";
import { Constraint } from "./Constraint";

export class AlternativeShift extends Constraint {
    weight: string;
    shiftId: string;
    constructor(name: string, displayName: string) {
        super(name, displayName)
        this.weight= BASE_VALUE;
        this.shiftId = '';
    }

    validateConstraint(c: Constraint): void {
        const constraint = c as AlternativeShift;
        if(constraint) {
            if(constraint.displayName !== this.displayName || constraint.shiftId !== this.shiftId){
                return;
            }
            if(constraint.weight !== this.weight) {
                throw new Exception(this.getContradictionErrorMessage());
            }
            throw new Exception(this.getContradictionErrorMessage());
        }
    }
}