import { BASE_VALUE } from "../constants/constraints";
import { Exception } from "../utils/Exception";
import { Constraint, ConstraintInterface } from "./Constraint";

export class AlternativeShift extends Constraint {
    weight: string;
    shiftId: string;
    constructor(name: string, displayName: string, description?: string) {
        super(name, displayName, description)
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
    
    toJson(): AlternativeShiftInterface {
        return {
            name: this.name,
            shiftId: this.shiftId,
            weight: this.weight,    
        }
    }

    clone(): AlternativeShift {
        const newConstraint: AlternativeShift = new AlternativeShift(this.name, this.displayName, this.description);
        newConstraint.shiftId = this.shiftId;
        newConstraint.weight = this.weight;
        return newConstraint;
    }
    equals(c: AlternativeShift): boolean {
        return this.name === c.name && this.shiftId === c.shiftId && this.weight === c.weight;
    }


    fromJson(c: AlternativeShiftInterface): void {
        this.shiftId = c.shiftId;
        this.weight = c.weight;
    }
}

export interface AlternativeShiftInterface extends ConstraintInterface{
    shiftId: string;
    weight: string;
}