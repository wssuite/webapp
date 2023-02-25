import { MinMaxConstraint } from "./MinMaxConstraint";

export class MinMaxShiftConstraint extends MinMaxConstraint{

    shiftId: string;

    constructor(name:string, displayName: string) {
        super(name, displayName);
        this.shiftId = '';
    }
}