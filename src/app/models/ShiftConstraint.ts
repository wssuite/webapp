import { IntegerConstraint } from "./IntegerConstraint";

export class ShiftConstraint extends IntegerConstraint {
    shiftId: string;
    constructor(name: string, displayName: string) {
        super(name, displayName);
        this.shiftId = '';
    }
}