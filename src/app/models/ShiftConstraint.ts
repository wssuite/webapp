import { Exception } from "../utils/Exception";
import { Constraint } from "./Constraint";
import { IntegerConstraint, IntegerConstraintInterface } from "./IntegerConstraint";

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

    override toJson(): ShiftConstraintInterface {
        return {
            name: this.name,
            value: this.value,
            weight: this.weight,
            shiftId: this.shiftId,
        }
    }

    override fromJson(c: ShiftConstraintInterface): void {
        super.fromJson(c as IntegerConstraintInterface);
        this.shiftId = c.shiftId;
    }

    override clone(): ShiftConstraint {
        const ret = new ShiftConstraint(this.name, this.displayName);
        ret.value = this.value;
        ret.weight = this.weight;
        ret.shiftId = this.shiftId;
        return ret;
    }

    override equals(c: ShiftConstraint): boolean {
        return super.equals(c) && this.shiftId === c.shiftId;
    }
}

export interface ShiftConstraintInterface extends IntegerConstraintInterface {
    shiftId: string;
}