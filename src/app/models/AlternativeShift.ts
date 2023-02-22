import { ALTERNATIVE_SHIFT_ID, BASE_VALUE } from "../constants/constraints";
import { Constraint } from "./Constraint";

export class AlternativeShift extends Constraint {
    weight: string;
    shiftId: string;
    constructor(name: string) {
        super(ALTERNATIVE_SHIFT_ID,name)
        this.weight= BASE_VALUE;
        this.shiftId = '';
    }
}