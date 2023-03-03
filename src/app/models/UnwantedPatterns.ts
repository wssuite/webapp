import { BASE_VALUE} from "../constants/constraints";
import { Constraint } from "./Constraint";
import { PatternElement } from "./PatternElement";

export class UnwantedPatterns extends Constraint{
    patternElements: PatternElement[];
    weight: string;
    constructor(name:string, displayName: string) {
        super(name, displayName);
        this.patternElements = [{
            dayName:'',
            shiftId:'',
        }]
        this.weight = BASE_VALUE;
    }
}