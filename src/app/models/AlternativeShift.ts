import { BASE_VALUE } from "../constants/constraints";
import { Constraint } from "./Constraint";

export class AlternativeShift extends Constraint {
    weight: string;
    shiftId: string;
    constructor(name: string, displayName: string) {
        super(name, displayName)
        this.weight= BASE_VALUE;
        this.shiftId = '';
    }
}