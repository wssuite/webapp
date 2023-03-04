import { BASE_VALUE} from "../constants/constraints";
import { Constraint, ConstraintInterface } from "./Constraint";
import { PatternElement, PatternElementInterface } from "./PatternElement";

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

    toJson(): UnwantedPatternsInterface{
        const elements: PatternElementInterface[] = [];
        for(const pattern of this.patternElements){
            elements.push(pattern.toJson());
        }

        return {
            name: this.name,
            weight: this.weight,
            patternElements: elements,
        }
    }

    fromJson(c: UnwantedPatternsInterface): void {
        this.weight = c.weight;
        for(const p of c.patternElements){
            const pattern = new PatternElement();
            pattern.fromJson(p);
            this.patternElements.push(pattern);
        }
    }
}

export interface UnwantedPatternsInterface extends ConstraintInterface {
    patternElements: PatternElementInterface[];
    weight: string;
}