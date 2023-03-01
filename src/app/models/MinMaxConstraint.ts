import { BASE_VALUE } from "../constants/constraints";
import { Exception } from "../utils/Exception";
import { Constraint } from "./Constraint";

export class MinMaxConstraint extends Constraint {
    
    minValue: string;
    maxValue: string;
    minWeight: string;
    maxWeight:string;
    
    constructor(name:string, displayName: string) {
        super(name, displayName);
        this.minValue = BASE_VALUE;
        this.maxValue = BASE_VALUE;
        this.minWeight = BASE_VALUE;
        this.maxWeight = BASE_VALUE;
    }

    validateConstraint(c:Constraint): void {
        const constraint = c as MinMaxConstraint;
        if(!constraint){
            return;
        }
        if(this.displayName !== constraint.displayName){
            return;
        }
        if(this.minValue === constraint.minValue &&
            this.minWeight === constraint.minWeight &&
            this.maxValue === constraint.maxValue &&
            this.maxWeight === constraint.maxWeight) {
                throw new Exception(this.getRepetitiveErrorMessage());
            }
        throw new Exception(this.getContradictionErrorMessage());
    }
}