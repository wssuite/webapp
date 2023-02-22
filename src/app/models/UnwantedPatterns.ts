import { BASE_VALUE, UNWANTED_PATTERNS_ID } from "../constants/constraints";
import { Constraint } from "./Constraint";
import { PatternElement } from "./PatternElement";

export class UnwantedPatterns extends Constraint{
    patternElements: PatternElement[];
    weight: string;
    constructor(name:string) {
        super(UNWANTED_PATTERNS_ID, name);
        this.patternElements = [{
            dayName:'',
            shiftId:'',
        }]
        this.weight = BASE_VALUE;
    }
}