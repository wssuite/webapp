import { BASE_VALUE } from "../constants/constraints";
import { Constraint, ConstraintInterface } from "./Constraint";

export class UnwantedSkills extends Constraint{
    skills: string[]
    weight: string;
    
    constructor(id: string, name: string){
        super(id, name);
        this.skills = [""];
        this.weight = BASE_VALUE;
    }
    
    validateConstraint(c: Constraint): void {
        throw new Error("Method not implemented.");
    }
    
    toJson(): ConstraintInterface {
        throw new Error("Method not implemented.");
    }
}