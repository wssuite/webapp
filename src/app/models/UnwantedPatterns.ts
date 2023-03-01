import { BASE_VALUE} from "../constants/constraints";
import { Constraint } from "./Constraint";
import { PatternElement } from "./PatternElement";

export class UnwantedPatterns extends Constraint{
    patternElements: PatternElement[];
    weight: string;
    constructor(name:string, displayName: string) {
        super(name, displayName);
        this.patternElements = [new PatternElement()]
        this.weight = BASE_VALUE;
    }

    validateConstraint(c: Constraint): void {
        const constraint = c as UnwantedPatterns;
        if(!constraint){
            return;
        }
        if(this.displayName !== constraint.displayName) {
            return;
        }
        constraint.patternElements.forEach((p: PatternElement)=>{
            this.patternElements.forEach((tp:PatternElement)=>{
                tp.validatePattern(p);
            })
        })
    }
}