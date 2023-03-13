import { BASE_VALUE } from "../constants/constraints";
import { Exception } from "../utils/Exception";
import { Constraint } from "./Constraint";

export class UnwantedSkills extends Constraint{
    skills: string[]
    weight: string;
    
    constructor(id: string, name: string){
        super(id, name);
        this.skills = [""];
        this.weight = BASE_VALUE;
    }
    
    validateConstraint(c: Constraint): void {
        const constraint = c as UnwantedSkills;
        if(!constraint){
            return;
        }

        if(this.displayName !== constraint.displayName) {
            return;
        }
        constraint.skills.forEach((s:string)=>{
            if(this.skills.includes(s)){
                throw new Exception(this.getRepetitiveErrorMessage())
            }
        })
    }
    
    toJson(): unwantedSkillsInterface {
        return {
            name: this.name,
            skills: this.skills,
            weight: this.weight,
        }
    }
}

export interface unwantedSkillsInterface {
    name: string;
    skills: string[];
    weight: string;
}