import { Exception } from "../utils/Exception";
import { Constraint} from "./Constraint";
import { MinMaxConstraint, MinMaxConstraintInterface } from "./MinMaxConstraint";

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

    override toJson(): MinMaxShiftConstraintInterface {
        return {
            name: this.name,
            minValue: this.minValue,
            minWeight: this.minWeight,
            maxValue: this.maxValue,
            maxWeight: this.maxWeight,
            shiftId: this.shiftId,
        }
    }

    override fromJson(c: MinMaxShiftConstraintInterface): void {
        super.fromJson(c as MinMaxConstraintInterface);
        this.shiftId = c.shiftId;
    }

    override clone(): MinMaxShiftConstraint {
        const ret = new MinMaxShiftConstraint(this.name, this.displayName);
        ret.minValue = this.minValue;
        ret.maxValue = this.maxValue;
        ret.minWeight = this.minWeight;
        ret.maxWeight = this.maxWeight;
        ret.shiftId = this.shiftId;
        return ret;
    }

    override equals(c: MinMaxShiftConstraint): boolean {
        return super.equals(c) && this.shiftId === c.shiftId;        
    }
}

export interface MinMaxShiftConstraintInterface extends MinMaxConstraintInterface {
    shiftId: string;
}